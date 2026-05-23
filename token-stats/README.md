# TokenStats

TokenStats is a React application that provides a landing page for users to manage their API keys and select different providers. The application utilizes Auth0 or OAuth for user authentication and is styled using Tailwind CSS.

## Features

- User authentication via Auth0 or OAuth
- Provider selection for different API services
- Input field for users to paste their API keys
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd token-stats
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Configuration

1. Set up your Auth0 or OAuth credentials and update the necessary environment variables in your `.env` file.

2. If you are using Tailwind CSS, ensure that your `tailwind.config.js` is properly configured to include the paths to your template files.

### Running the Application

To start the development server, run:

```
npm run dev
```

The application will be available at `http://localhost:3000`.

### Usage

- Navigate to the landing page.
- Click the login button to authenticate.
- Select a provider from the dropdown menu.
- Paste your API key in the provided input field.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.