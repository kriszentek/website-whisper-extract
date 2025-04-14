
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
- Save model preferences and custom prompts locally
- Display structured results
- No API key required - the application uses a server-side implementation

## Architecture

The application is built using:
- React (with TypeScript)
- Vite
- Tailwind CSS
- shadcn/ui component library
- OpenAI API (via Supabase Edge Functions)
- Local storage for user preferences
- Supabase for backend integration

The app follows a component-based architecture with separation of concerns between UI components, services, and utilities.

## Supabase Integration

The application uses Supabase for backend functionality:

- **Edge Functions**: Handle secure API communication with OpenAI
- **Database**: Stores application settings including the OpenAI API key
- **Security**: Implements Row Level Security (RLS) to protect sensitive data

### Server-side API Processing

Instead of requiring users to provide their own OpenAI API key, the application:

1. Stores the API key securely in the Supabase database
2. Uses a Supabase Edge Function to make API requests to OpenAI
3. Returns processed results to the frontend

This approach improves security and user experience by eliminating the need for users to obtain and manage their own API keys.
