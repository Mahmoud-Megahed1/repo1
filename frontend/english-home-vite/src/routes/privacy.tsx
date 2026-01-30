import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@ui/card';
import { Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy')({
    component: PrivacyPolicy,
});

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
                    <Button asChild variant="outline" size="sm">
                        <Link to="/">
                            <Home className="mr-2 size-4" />
                            Home
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Privacy Policy for Englishom</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-slate max-w-none dark:prose-invert">
                        <p><strong>Effective Date:</strong> January 26, 2026</p>

                        <h3>1. Introduction</h3>
                        <p>
                            Welcome to Englishom. We value your privacy and are committed to protecting your personal data.
                            This Privacy Policy explains how we collect, use, and share your information when you use our website and services.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, and profile picture (from Google/Facebook login).</li>
                            <li><strong>Usage Data:</strong> Progress in courses, quiz results, and audio recordings for pronunciation practice.</li>
                            <li><strong>Technical Data:</strong> IP address, device type, and browser information.</li>
                        </ul>

                        <h3>3. How We Use Your Information</h3>
                        <p>We use your data to:</p>
                        <ul>
                            <li>Provide and improve our English learning services.</li>
                            <li>Personalize your learning experience.</li>
                            <li>Authenticate your identity via Google or Facebook.</li>
                            <li>Communicate with you regarding your account and updates.</li>
                        </ul>

                        <h3>4. Data Sharing</h3>
                        <p>
                            We do not sell your personal data. We may share data with trusted third-party service providers (e.g., payment processors like Paymob, email services like Brevo) solely for the purpose of operating our services.
                        </p>

                        <h3>5. User Rights</h3>
                        <p>
                            You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us ensuring your request is clear.
                        </p>

                        <h3>6. Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@englishom.com">support@englishom.com</a>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
