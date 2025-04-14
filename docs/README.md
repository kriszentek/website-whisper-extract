
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

Website Whisper allows users to input a website URL and extract structured information about the company behind that website. The application uses OpenAI's API to analyze websites and extract predefined or custom information fields.

### Key Features

- Extract company information from websites using AI
- Customize fields to extract
- Edit and customize the prompt sent to OpenAI
- Save API key and model preferences
- Display structured results

## Architecture

The application is built using:
- React (with TypeScript)
- Vite
- Tailwind CSS
- shadcn/ui component library
- OpenAI API
- Local storage for persistence
- Supabase for backend integration

The app follows a component-based architecture with separation of concerns between UI components, services, and utilities.
