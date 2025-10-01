export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <h1 className="text-7xl font-bold text-gray-800">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Oops! The page you are looking for doesn’t exist.
      </p>

      <a
        href="/"
        className="mt-8 px-6 py-2 rounded-3xl bg-green-600 hover:bg-green-400 text-white font-medium transition"
      >
        Go Back Home
      </a>
    </div>
  );
}
