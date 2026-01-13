import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get current user's active profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT id, user_id, full_name, birth_date, birth_time, birth_place, is_active, created_at, updated_at 
       FROM user_profiles 
       WHERE user_id = $1 AND is_active = true`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ success: true, profile: null });
    }

    const profile = result.rows[0];
    res.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        birthDate: profile.birth_date,
        birthTime: profile.birth_time,
        birthPlace: profile.birth_place,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all profiles for current user
router.get('/all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT id, user_id, full_name, birth_date, birth_time, birth_place, is_active, created_at, updated_at 
       FROM user_profiles 
       WHERE user_id = $1 
       ORDER BY is_active DESC, created_at DESC`,
      [userId]
    );

    const profiles = result.rows.map(profile => ({
      id: profile.id,
      userId: profile.user_id,
      fullName: profile.full_name,
      birthDate: profile.birth_date,
      birthTime: profile.birth_time,
      birthPlace: profile.birth_place,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }));

    res.json({
      success: true,
      profiles
    });
  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new profile (always creates, never updates)
router.post('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { fullName, birthDate, birthTime, birthPlace, setAsActive } = req.body;

    if (!fullName || !birthDate) {
      return res.status(400).json({ error: 'Full name and birth date are required' });
    }

    // Validate birth date
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birth date format' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // If setAsActive is true, deactivate all other profiles
      if (setAsActive) {
        await client.query(
          'UPDATE user_profiles SET is_active = false WHERE user_id = $1',
          [userId]
        );
      }

      // Check if this is the first profile - make it active by default
      const existingCount = await client.query(
        'SELECT COUNT(*) as count FROM user_profiles WHERE user_id = $1',
        [userId]
      );
      const isFirstProfile = parseInt(existingCount.rows[0].count) === 0;
      const shouldBeActive = setAsActive !== false && (isFirstProfile || setAsActive === true);

      // Create new profile
      const result = await client.query(
        `INSERT INTO user_profiles (user_id, full_name, birth_date, birth_time, birth_place, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, user_id, full_name, birth_date, birth_time, birth_place, is_active, created_at, updated_at`,
        [userId, fullName, birthDate, birthTime || null, birthPlace || null, shouldBeActive]
      );

      await client.query('COMMIT');

      const profile = result.rows[0];
      res.status(201).json({
        success: true,
        profile: {
          id: profile.id,
          userId: profile.user_id,
          fullName: profile.full_name,
          birthDate: profile.birth_date,
          birthTime: profile.birth_time,
          birthPlace: profile.birth_place,
          isActive: profile.is_active,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      });
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error('Create profile error:', error);
    
    const pgError = error as { code?: string; message?: string };
    // Provide more detailed error information
    if (pgError.code === '42P01') {
      // Table does not exist
      return res.status(500).json({ 
        error: 'Database table not found. Please run migration: npm run migrate' 
      });
    }
    
    if (pgError.code === '23503') {
      // Foreign key violation
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? pgError.message : undefined
    });
  }
});

// Update specific profile by ID
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const profileId = req.params.id;
    const { fullName, birthDate, birthTime, birthPlace } = req.body;

    if (!fullName || !birthDate) {
      return res.status(400).json({ error: 'Full name and birth date are required' });
    }

    // Validate birth date
    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birth date format' });
    }

    // Verify profile belongs to user
    const verifyResult = await pool.query(
      'SELECT id FROM user_profiles WHERE id = $1 AND user_id = $2',
      [profileId, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Update profile
    const result = await pool.query(
      `UPDATE user_profiles 
       SET full_name = $1, birth_date = $2, birth_time = $3, birth_place = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING id, user_id, full_name, birth_date, birth_time, birth_place, is_active, created_at, updated_at`,
      [fullName, birthDate, birthTime || null, birthPlace || null, profileId, userId]
    );

    const profile = result.rows[0];
    res.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        birthDate: profile.birth_date,
        birthTime: profile.birth_time,
        birthPlace: profile.birth_place,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    });
  } catch (error: unknown) {
    console.error('Update profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// Delete specific profile by ID
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const profileId = req.params.id;

    // Verify profile belongs to user
    const verifyResult = await pool.query(
      'SELECT id, is_active FROM user_profiles WHERE id = $1 AND user_id = $2',
      [profileId, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const wasActive = verifyResult.rows[0].is_active;

    // Delete profile
    await pool.query('DELETE FROM user_profiles WHERE id = $1 AND user_id = $2', [profileId, userId]);

    // If deleted profile was active, activate the most recent profile
    if (wasActive) {
      const remainingResult = await pool.query(
        `UPDATE user_profiles 
         SET is_active = true 
         WHERE user_id = $1 AND id = (
           SELECT id FROM user_profiles 
           WHERE user_id = $1 
           ORDER BY created_at DESC 
           LIMIT 1
         )
         RETURNING id`,
        [userId]
      );
    }

    res.json({ success: true, message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set profile as active
router.post('/:id/activate', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const profileId = req.params.id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verify profile belongs to user
      const verifyResult = await client.query(
        'SELECT id FROM user_profiles WHERE id = $1 AND user_id = $2',
        [profileId, userId]
      );

      if (verifyResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Deactivate all profiles for this user
      await client.query(
        'UPDATE user_profiles SET is_active = false WHERE user_id = $1',
        [userId]
      );

      // Activate the selected profile
      const result = await client.query(
        `UPDATE user_profiles 
         SET is_active = true 
         WHERE id = $1 AND user_id = $2
         RETURNING id, user_id, full_name, birth_date, birth_time, birth_place, is_active, created_at, updated_at`,
        [profileId, userId]
      );

      await client.query('COMMIT');

      const profile = result.rows[0];
      res.json({
        success: true,
        profile: {
          id: profile.id,
          userId: profile.user_id,
          fullName: profile.full_name,
          birthDate: profile.birth_date,
          birthTime: profile.birth_time,
          birthPlace: profile.birth_place,
          isActive: profile.is_active,
          createdAt: profile.created_at,
          updatedAt: profile.updated_at
        }
      });
    } catch (error: unknown) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    console.error('Activate profile error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

export default router;

