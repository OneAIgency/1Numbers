import { Router, Request, Response } from 'express';
import pool from '../db';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Create journal entry
router.post('/entry', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { entryType, title, content, date, numerologyData, tags, mood } = req.body;

    if (!title || !entryType) {
      return res.status(400).json({ error: 'Title and entry type are required' });
    }

    if (!['journal', 'prediction'].includes(entryType)) {
      return res.status(400).json({ error: 'Invalid entry type' });
    }

    const result = await pool.query(
      `INSERT INTO journal_entries (user_id, entry_type, title, content, date, numerology_data, tags, mood)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, entry_type, title, content, date, numerology_data, tags, mood, created_at, updated_at`,
      [
        userId,
        entryType,
        title,
        content || null,
        date || new Date().toISOString().split('T')[0],
        numerologyData ? JSON.stringify(numerologyData) : null,
        tags || [],
        mood || null,
      ]
    );

    const entry = result.rows[0];
    res.status(201).json({
      success: true,
      entry: {
        id: entry.id,
        userId: entry.user_id,
        entryType: entry.entry_type,
        title: entry.title,
        content: entry.content,
        date: entry.date,
        numerologyData: entry.numerology_data,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      },
    });
  } catch (error: unknown) {
    console.error('Create journal entry error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

// Get all journal entries for user
router.get('/entries', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const { entryType, startDate, endDate, limit = 100, offset = 0 } = req.query;

    let query = `
      SELECT id, user_id, entry_type, title, content, date, numerology_data, tags, mood, created_at, updated_at
      FROM journal_entries
      WHERE user_id = $1
    `;
    const params: (string | number)[] = [userId];
    let paramIndex = 2;

    if (entryType && typeof entryType === 'string') {
      query += ` AND entry_type = $${paramIndex}`;
      params.push(entryType);
      paramIndex++;
    }

    if (startDate && typeof startDate === 'string') {
      query += ` AND date >= $${paramIndex}`;
      params.push(startDate);
      paramIndex++;
    }

    if (endDate && typeof endDate === 'string') {
      query += ` AND date <= $${paramIndex}`;
      params.push(endDate);
      paramIndex++;
    }

    query += ` ORDER BY date DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    const entries = result.rows.map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      entryType: entry.entry_type,
      title: entry.title,
      content: entry.content,
      date: entry.date,
      numerologyData: entry.numerology_data,
      tags: entry.tags,
      mood: entry.mood,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at,
    }));

    res.json({
      success: true,
      entries,
      total: entries.length,
    });
  } catch (error: unknown) {
    console.error('Get journal entries error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

// Update journal entry
router.put('/entry/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const entryId = req.params.id;
    const { title, content, date, numerologyData, tags, mood } = req.body;

    // Verify entry belongs to user
    const verifyResult = await pool.query(
      'SELECT id FROM journal_entries WHERE id = $1 AND user_id = $2',
      [entryId, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    const result = await pool.query(
      `UPDATE journal_entries
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           date = COALESCE($3, date),
           numerology_data = COALESCE($4::jsonb, numerology_data),
           tags = COALESCE($5, tags),
           mood = COALESCE($6, mood),
           updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING id, user_id, entry_type, title, content, date, numerology_data, tags, mood, created_at, updated_at`,
      [
        title || null,
        content || null,
        date || null,
        numerologyData ? JSON.stringify(numerologyData) : null,
        tags || null,
        mood || null,
        entryId,
        userId,
      ]
    );

    const entry = result.rows[0];
    res.json({
      success: true,
      entry: {
        id: entry.id,
        userId: entry.user_id,
        entryType: entry.entry_type,
        title: entry.title,
        content: entry.content,
        date: entry.date,
        numerologyData: entry.numerology_data,
        tags: entry.tags,
        mood: entry.mood,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      },
    });
  } catch (error: unknown) {
    console.error('Update journal entry error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

// Delete journal entry
router.delete('/entry/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const entryId = req.params.id;

    // Verify entry belongs to user
    const verifyResult = await pool.query(
      'SELECT id FROM journal_entries WHERE id = $1 AND user_id = $2',
      [entryId, userId]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    await pool.query('DELETE FROM journal_entries WHERE id = $1 AND user_id = $2', [entryId, userId]);

    res.json({ success: true, message: 'Journal entry deleted successfully' });
  } catch (error: unknown) {
    console.error('Delete journal entry error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

// Get journal statistics
router.get('/statistics', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found' });
    }

    const { startDate, endDate } = req.query;

    let dateFilter = '';
    const params: (string | number)[] = [userId];
    let paramIndex = 2;

    if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
      dateFilter = ` AND date BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      params.push(startDate, endDate);
      paramIndex += 2;
    }

    // Get total entries
    const totalResult = await pool.query(
      `SELECT COUNT(*) as count FROM journal_entries WHERE user_id = $1${dateFilter}`,
      params
    );

    // Get entries by type
    const typeResult = await pool.query(
      `SELECT entry_type, COUNT(*) as count
       FROM journal_entries
       WHERE user_id = $1${dateFilter}
       GROUP BY entry_type`,
      params
    );

    // Get entries by mood
    const moodResult = await pool.query(
      `SELECT mood, COUNT(*) as count
       FROM journal_entries
       WHERE user_id = $1 AND mood IS NOT NULL${dateFilter}
       GROUP BY mood
       ORDER BY count DESC`,
      params
    );

    // Get most common tags
    const tagsResult = await pool.query(
      `SELECT unnest(tags) as tag, COUNT(*) as count
       FROM journal_entries
       WHERE user_id = $1 AND array_length(tags, 1) > 0${dateFilter}
       GROUP BY tag
       ORDER BY count DESC
       LIMIT 10`,
      params
    );

    // Get entries per month
    const monthlyResult = await pool.query(
      `SELECT 
         TO_CHAR(date, 'YYYY-MM') as month,
         COUNT(*) as count
       FROM journal_entries
       WHERE user_id = $1${dateFilter}
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`,
      params
    );

    res.json({
      success: true,
      statistics: {
        totalEntries: parseInt(totalResult.rows[0].count),
        entriesByType: typeResult.rows.reduce((acc, row) => {
          acc[row.entry_type] = parseInt(row.count);
          return acc;
        }, {} as Record<string, number>),
        entriesByMood: moodResult.rows.map((row) => ({
          mood: row.mood,
          count: parseInt(row.count),
        })),
        topTags: tagsResult.rows.map((row) => ({
          tag: row.tag,
          count: parseInt(row.count),
        })),
        entriesPerMonth: monthlyResult.rows.map((row) => ({
          month: row.month,
          count: parseInt(row.count),
        })),
      },
    });
  } catch (error: unknown) {
    console.error('Get journal statistics error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
});

export default router;

