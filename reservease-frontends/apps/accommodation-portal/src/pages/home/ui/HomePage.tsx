
// Demonstrating the usage of the shared UI package
// import { Button } from '@reservease/ui/components/button';

export function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16 text-center text-zinc-900 dark:text-zinc-100">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-blue-900 dark:text-blue-400">
        Accommodation Management Portal
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
        Welcome! You're currently viewing the brand new accommodation portal built on the strict Feature-Sliced Design (FSD) architecture inside the Monorepo.
      </p>
      <div className="flex gap-4 justify-center">
        {/* <Button variant="default">List Property</Button> */}
        {/* <Button variant="outline">View Dashboard</Button> */}
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">List Property</button>
        <button className="px-6 py-2 bg-transparent border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">View Dashboard</button>
      </div>
    </main>
  );
}
