export default function FallbackElement() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Loading...</h1>
                <p className="text-lg text-gray-600">Please wait while we load the content.</p>
            </div>
        </div>
    );
}