export default function Footer() {
  return (
    <footer className="mt-8 border-t border-gray-200 bg-gray-50 sm:mt-12">
      <div className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-4 sm:py-6 lg:px-6">
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ShopCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
