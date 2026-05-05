# Music Management Frontend

A modern React-based web application for managing music collections, including albums, artists, genres, and tracks.

## Features

- **Album Management**: View and organize your music albums.
- **Artist Database**: Keep track of your favorite artists.
- **Genre Classification**: Categorize music by genre.
- **Track List**: Detailed view of all music tracks.
- **Authentication**: Secure login and registration system.
- **Responsive Design**: Clean and interactive UI.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd music_management_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:
```bash
npm start
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The build artifacts will be stored in the `build/` directory.

## Dependencies

The project uses the following major libraries:
- **React**: UI library
- **React Router Dom**: Client-side routing
- **React Scripts**: Build tools and scripts

For a full list of dependencies, see `package.json` or `requirements.txt`.

## Troubleshooting

### EPERM Error
If you encounter an `EPERM: process.cwd failed` error on macOS, it is likely due to a stale terminal session.
**Solution**: Close your current terminal tab and open a new one, or run:
```bash
cd .. && cd music_management_frontend
```

### Module Not Found (index.html)
If webpack cannot find `public/index.html`, ensure you are running the command from the root directory of the project and that the `public` folder exists.
# music_management_frontend
