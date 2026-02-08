'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, Settings } from 'lucide-react';
import { useState } from 'react';
import GlobalAISettings from './global-ai-settings';
import LessonAIInstructions from './lesson-ai-instructions';

export default function SettingsTabs() {
    const [activeTab, setActiveTab] = useState<'global' | 'lessons'>('global');

    return (
        <div className="space-y-6">
            <div className="mb-6 grid w-full grid-cols-2 rounded-lg bg-muted p-1">
                <button
                    onClick={() => setActiveTab('global')}
                    className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'global'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-background/50'
                        }`}
                >
                    <Settings className="h-4 w-4" />
                    Global Settings
                </button>
                <button
                    onClick={() => setActiveTab('lessons')}
                    className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${activeTab === 'lessons'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-background/50'
                        }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Lesson Instructions
                </button>
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-200">
                {activeTab === 'global' ? <GlobalAISettings /> : <LessonAIInstructions />}
            </div>
        </div>
    );
}
