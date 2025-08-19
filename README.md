# Akashyk - An AI Memory Repository

Akashyk is a web application designed to act as a centralized, persistent long-term memory for all your AI interactions. The goal is to eliminate the need for manual copy-pasting of past conversations and documents by providing a single source of truth that your AI models can access.

I was tired of trying to switch between and navigate convos, and was shocked the AIs didn't generally remember previous convos (or could access them).

## ✨ Features

This project is being developed in three main epochs.

### Epoch 1: The Core Repository
* **User Authentication:** Secure sign-up and sign-in.
* **Manual Ingestion:** Add text-based memories, documents, and images through a user interface.
* **Secure Storage:** Personal data is securely stored and can only be accessed by the authenticated user.

### Epoch 2: AI-Powered Organization
* **Automated Summarization:** AI automatically processes new memories to generate summaries and extract key concepts.
* **Semantic Search:** Memories are converted into vector embeddings for advanced natural language search.
* **AI-driven Indexing:** AI organizes memories into a logical, high-level directory structure.

### Epoch 3: The Retrieval API & Enhanced UI
* **AI-Facing API:** A dedicated API endpoint for AI models to query the memory repository.
* **Advanced Dashboard:** An enhanced user interface to view and navigate the AI-generated directory and summaries.

## 🛠️ Technical Stack

* **Frontend:** **Next.js** (App Router), **TypeScript**, **Tailwind CSS**.
* **Backend & Database:** **Supabase** (PostgreSQL, Auth, Storage, Edge Functions).

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* A free account on [Supabase](https://supabase.com/).

### 1. Configure Supabase & Environment Variables
1.  Create a new project in your [Supabase Dashboard](https://supabase.com/).
2.  Navigate to **Project Settings > API** and copy your **Project URL** and **`anon` key**.
3.  In the root of your project, create a file named `.env.local` and add the following:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL_HERE
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
    ```

### 2. Set up the Database Schema
1.  In your Supabase Dashboard, go to the **SQL Editor**.
2.  Paste and run the following SQL code to create the `memories` table and set up **Row Level Security (RLS)**. This is a critical security step.

    ```sql
    -- memories table to store all conversation, document, and image data
    create table memories (
      id uuid default gen_random_uuid() primary key,
      user_id uuid references auth.users not null,
      type text not null,
      title text,
      content text,
      file_url text,
      created_at timestamp with time zone default now()
    );

    -- Enable RLS for the memories table
    alter table memories enable row level security;

    -- RLS Policies
    create policy "Enable insert for authenticated users only"
    on memories for insert
    with check ( auth.uid() = user_id );

    create policy "Enable select for users based on user_id"
    on memories for select
    using ( auth.uid() = user_id );

    create policy "Enable update for users based on user_id"
    on memories for update
    using ( auth.uid() = user_id );

    create policy "Enable delete for users based on user_id"
    on memories for delete
    using ( auth.uid() = user_id );
    ```

### 3. Run the Application
```bash
npm install
npm run dev












