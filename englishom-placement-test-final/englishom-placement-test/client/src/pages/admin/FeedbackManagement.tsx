import React, { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

const LEVELS = ["beginner", "elementary", "intermediate", "upper-intermediate", "advanced"];
const SCORE_RANGES = ["90-100", "70-89", "0-69"];

export default function FeedbackManagement() {
  const utils = trpc.useContext();
  
  const { data: messages, isLoading } = trpc.admin.getAllMessages.useQuery();
  const upsertMessageMutation = trpc.admin.upsertMessage.useMutation({
    onSuccess: () => {
      alert("Feedback message updated successfully");
      utils.admin.getAllMessages.invalidate();
    },
    onError: (error) => {
      alert(error.message || "Failed to update feedback message");
    }
  });

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const getMessageText = (level: string, range: string) => {
    return messages?.find(m => m.level === level && m.scoreRange === range)?.message || "";
  };

  const handleEdit = (level: string, range: string) => {
    setEditingKey(`${level}-${range}`);
    setEditValue(getMessageText(level, range));
  };

  const handleSave = async (level: string, range: string) => {
    await upsertMessageMutation.mutateAsync({
      level,
      scoreRange: range,
      message: editValue,
    });
    setEditingKey(null);
  };

  return (
    <div className="space-y-8 bg-white/50 dark:bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Feedback Messages Configuration
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Customize the feedback shown to students at the end of their test, based on their final level and score.
        </p>
      </div>

      <div className="space-y-10">
        {LEVELS.map((level) => (
          <div key={level} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 capitalize">
                {level.replace("-", " ")} Level
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              {SCORE_RANGES.map((range) => {
                const key = `${level}-${range}`;
                const isEditing = editingKey === key;
                const currentMessage = getMessageText(level, range);
                const hasMessage = currentMessage.trim().length > 0;

                return (
                  <div key={range} className="flex flex-col md:flex-row gap-4 items-start p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-md">
                    <div className="w-full md:w-32 pt-2 flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Score: {range}%</span>
                      {hasMessage && !isEditing && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    </div>
                    
                    <div className="flex-1 w-full">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="min-h-[100px] w-full resize-y"
                            placeholder="Enter the feedback message for this score range..."
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleSave(level, range)}
                              disabled={upsertMessageMutation.isPending}
                              className="bg-indigo-600 hover:bg-indigo-700"
                              size="sm"
                            >
                              {upsertMessageMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                              Save Message
                            </Button>
                            <Button 
                              onClick={() => setEditingKey(null)}
                              variant="outline"
                              size="sm"
                              disabled={upsertMessageMutation.isPending}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`w-full p-3 rounded-md border text-sm cursor-text transition-colors ${
                            hasMessage 
                              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300' 
                              : 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-500/70 hover:border-amber-300'
                          }`}
                          onClick={() => handleEdit(level, range)}
                        >
                          {hasMessage ? currentMessage : "No message configured yet. Click to add one."}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
