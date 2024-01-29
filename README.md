# 🎶 Work and Listen 🎧

Welcome to "Work and Listen," a website designed for people to listen to music while working. This project uses Next.js, integrates Magic for passwordless authentication, leverages Hasura for GraphQL queries, and fetches music video data from YouTube.

## Getting Started 🚀

### Prerequisites

- Node.js (LTS version)
- npm or yarn
- Hasura account
- Magic account
- YouTube Data API key

### Initial Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repository/work-and-listen.git
   cd work-and-listen
   ```

2. **Initialize the project:**

   ```bash
   npm init -y
   ```

3. **Install dependencies:**

   ```bash
   npm install next react react-dom magic-sdk @apollo/client graphql
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
MAGIC_SECRET_KEY=YOUR_MAGIC_SECRET_KEY
NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY=YOUR_NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY
DEVELOPMENT=false
HASURA_ADMIN_SECRET=YOUR_HASURA_ADMIN_SECRET
NEXT_PUBLIC_HASURA_URL=YOUR_NEXT_PUBLIC_HASURA_URL
HASURA_JWT_SECRET=YOUR_HASURA_JWT_SECRET
```

### Running the Project

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features 🌟

- **Passwordless Authentication:** Securely log in using Magic.
- **GraphQL Interface:** Interact with your data through Hasura.
- **Music Video Streaming:** Enjoy a wide range of music videos sourced from YouTube.

## Contributing 🤝

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

## License 📜

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments 🙏

Thanks to Magic, Hasura, and YouTube for providing the tools and APIs that power this project.
