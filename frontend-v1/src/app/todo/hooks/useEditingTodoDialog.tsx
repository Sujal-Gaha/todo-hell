import { Dispatch, SetStateAction } from "react";
import { Priority, Todo } from "../types/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const EditingTodoDialog = ({
  editingTodo,
  setEditingTodo,
  updateTodo,
}: {
  editingTodo: Todo | null;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}) => {
  return (
    <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
      <DialogContent className="bg-cyber-dark border-2 border-neon-pink/50 text-neon-pink max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-cyber text-neon-pink text-glow-pink">
            NEURAL TASK MODIFICATION
          </DialogTitle>
        </DialogHeader>
        {editingTodo && (
          <div className="space-y-6">
            <Input
              value={editingTodo.title}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              className="bg-cyber-darker border-2 border-neon-pink/30 text-neon-pink font-matrix focus:border-neon-pink focus:glow-pink"
            />
            <Textarea
              value={editingTodo.description}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                )
              }
              className="bg-cyber-darker border-2 border-neon-pink/30 text-neon-pink font-matrix focus:border-neon-pink focus:glow-pink"
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                value={editingTodo.priority}
                onValueChange={(value: Priority) =>
                  setEditingTodo((prev) =>
                    prev ? { ...prev, priority: value } : null
                  )
                }
              >
                <SelectTrigger className="bg-cyber-darker border-2 border-neon-purple/30 text-neon-purple font-matrix">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-cyber-dark border-2 border-neon-purple/50">
                  <SelectItem
                    value="low"
                    className="text-neon-blue font-matrix"
                  >
                    LOW PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-neon-yellow font-matrix"
                  >
                    MEDIUM PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="text-neon-orange font-matrix"
                  >
                    HIGH PRIORITY
                  </SelectItem>
                  <SelectItem
                    value="urgent"
                    className="text-neon-red font-matrix"
                  >
                    URGENT
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={
                  editingTodo.dueDate
                    ? editingTodo.dueDate.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setEditingTodo((prev) =>
                    prev
                      ? {
                          ...prev,
                          dueDate: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        }
                      : null
                  )
                }
                className="bg-cyber-darker border-2 border-neon-cyan/30 text-neon-cyan font-matrix focus:border-neon-cyan"
              />
            </div>
            <Input
              placeholder="CATEGORY TAG..."
              value={editingTodo.category || ""}
              onChange={(e) =>
                setEditingTodo((prev) =>
                  prev ? { ...prev, category: e.target.value } : null
                )
              }
              className="bg-cyber-darker border-2 border-neon-green/30 text-neon-green font-matrix focus:border-neon-green"
            />
            <Button
              onClick={() => {
                if (editingTodo) {
                  updateTodo(editingTodo.id, editingTodo);
                  setEditingTodo(null);
                }
              }}
              className="w-full h-12 cyber-button font-cyber font-bold text-cyber-dark"
            >
              UPDATE NEURAL LINK
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const useEditingTodoDialog = ({
  editingTodo,
  setEditingTodo,
  updateTodo,
}: {
  editingTodo: Todo | null;
  setEditingTodo: Dispatch<SetStateAction<Todo | null>>;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
}) => {
  return {
    EditingTodoDialogNode: (
      <EditingTodoDialog
        editingTodo={editingTodo}
        setEditingTodo={setEditingTodo}
        updateTodo={updateTodo}
      />
    ),
  };
};
