
# Website Whisper Documentation

Website Whisper is a web application that uses AI to extract company information from websites. This documentation provides detailed information about the implementation, architecture, and how to maintain or extend the application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Components](#key-components)
- [OpenAI Integration](#openai-integration)
- [Data Flow](#data-flow)
- [Local Storage](#local-storage)
- [Customization](#customization)
- [Supabase Integration](#supabase-integration)
- [Development Guide](#development-guide)

## Overview

Website Whisper allows users to input a website URL and extract structured information about the company behind that website. The application uses OpenAI's API (via a secure server-side implementation) to analyze websites and extract predefined or custom information fields.

### Key Features

- Extract company information from websites using AI
- Customize fields to extract
- Edit and customize the prompt sent to OpenAI
- Save model preferences and custom prompts using Supabase
- Display structured results
- No API key required - the application uses a server-side implementation

## Architecture

The application is built using:
- React (with TypeScript)
- Vite
- Tailwind CSS
- shadcn/ui component library
- OpenAI API (via Supabase Edge Functions)
- Supabase for backend integration

The app follows a component-based architecture with separation of concerns between UI components, services, and utilities.

## Key Components

### User Interface
- **WebsiteForm**: Collects website URLs from users
- **ResultsCard**: Displays structured information extracted from websites
- **CustomFieldsManager**: Allows users to customize extraction fields
- **PromptEditor**: Enables users to customize the AI prompt

### Services
- **openai-service**: Handles communication with the OpenAI API via Supabase Edge Functions

### Storage
- **Supabase Tables**: Stores application settings including OpenAI API key and custom prompts
- **Local Storage**: Fallback for storing custom extraction fields

## OpenAI Integration

The application uses the OpenAI API through a secure server-side implementation:

1. The OpenAI API key is stored securely in Supabase environment variables
2. Requests are processed through a Supabase Edge Function
3. The Edge Function handles all communication with OpenAI
4. Responses are formatted and returned to the client

### Prompt Customization

Users can customize the prompts sent to OpenAI to tailor the extraction process for specific needs. Custom prompts are stored in Supabase.

## Data Flow

1. **User Input**: User enters a website URL in the WebsiteForm
2. **API Request**: The application sends the URL to the Supabase Edge Function
3. **Edge Function Processing**:
   - The Edge Function retrieves the OpenAI API key from environment variables
   - It constructs a prompt based on the URL and extraction fields
   - It sends the request to OpenAI
   - It processes the response and returns structured data
4. **Results Display**: The application presents the structured information to the user

## Supabase Integration

The application integrates with Supabase for backend functionality:

- **Edge Functions**: Handle secure API communication with OpenAI
- **Database**: Stores application settings including custom prompts and model preferences
- **Environment Variables**: Securely store API keys

### Server-side API Processing

Instead of requiring users to provide their own OpenAI API key, the application:

1. Stores the API key securely as a Supabase environment variable
2. Uses a Supabase Edge Function to make API requests to OpenAI
3. Returns processed results to the frontend

This approach improves security and user experience by eliminating the need for users to obtain and manage their own API keys.

## Development Guide

For detailed information on developing and extending the application, refer to the [Development Guide](./development-guide.md).

## API Documentation

For details on the API integration, refer to the [API Documentation](./api.md).

## Components Documentation

For information on the UI components, refer to the [Components Documentation](./components.md).

## Utilities Documentation

For details on utility functions, refer to the [Utilities Documentation](./utilities.md).
