/**
 * MCP Server for Orchestrator
 * Model Context Protocol server for AI model integration
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'orchestrator-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'create_task',
      description: 'Create a new orchestrator task',
      inputSchema: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            description: 'Task description',
          },
          project_id: {
            type: 'string',
            description: 'Project ID (optional)',
          },
        },
        required: ['description'],
      },
    },
    {
      name: 'get_task_status',
      description: 'Get status of a task',
      inputSchema: {
        type: 'object',
        properties: {
          task_id: {
            type: 'string',
            description: 'Task ID',
          },
        },
        required: ['task_id'],
      },
    },
    {
      name: 'list_projects',
      description: 'List all projects',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ],
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'create_task':
      // Call orchestrator API
      const response = await fetch('http://127.0.0.1:8000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: args.description,
          project_id: args.project_id,
        }),
      });
      const task = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: `Task created: ${task.id}`,
          },
        ],
      };

    case 'get_task_status':
      const statusResponse = await fetch(
        `http://127.0.0.1:8000/api/tasks/${args.task_id}`
      );
      const status = await statusResponse.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(status, null, 2),
          },
        ],
      };

    case 'list_projects':
      const projectsResponse = await fetch('http://127.0.0.1:8000/api/projects');
      const projects = await projectsResponse.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(projects, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: 'orchestrator://tasks',
      name: 'All Tasks',
      description: 'List of all orchestrator tasks',
      mimeType: 'application/json',
    },
    {
      uri: 'orchestrator://projects',
      name: 'All Projects',
      description: 'List of all projects',
      mimeType: 'application/json',
    },
  ],
}));

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'orchestrator://tasks') {
    const response = await fetch('http://127.0.0.1:8000/api/tasks');
    const tasks = await response.json();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }

  if (uri === 'orchestrator://projects') {
    const response = await fetch('http://127.0.0.1:8000/api/projects');
    const projects = await response.json();
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(projects, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Orchestrator MCP Server running on stdio');
}

main().catch(console.error);

