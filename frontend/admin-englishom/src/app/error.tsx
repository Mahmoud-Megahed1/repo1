'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Something went wrong!
          </h2>
          <div
            style={{
              backgroundColor: '#fee2e2',
              borderColor: '#f87171',
              color: '#b91c1c',
              borderWidth: '1px',
              borderStyle: 'solid',
              padding: '1rem',
              borderRadius: '0.25rem',
              marginBottom: '1rem',
              maxWidth: '800px',
              overflow: 'auto',
            }}
          >
            <p style={{ fontWeight: 'bold' }}>Error: {error.message}</p>
            {error.digest && <p>Digest: {error.digest}</p>}
            {error.stack && (
              <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </pre>
            )}
          </div>
          <button
            onClick={() => reset()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
