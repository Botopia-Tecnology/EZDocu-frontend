import { Suspense } from 'react';
import { AcceptInviteContent } from './accept-invite-content';
import { Loader2 } from 'lucide-react';

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <AcceptInviteContent />
        </Suspense>
    );
}
