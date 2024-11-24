import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { Cross2Icon } from "@radix-ui/react-icons"; // Assuming you want to keep this

// Dialog Component Definitions
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950",
          className
        )}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2">
          <Cross2Icon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// New Code for Dialog Trigger and State Management
const EditClassModal = () => {
  const [isOpen, setIsOpen] = React.useState(false); // Manage dialog open/close state

  const handleDialogToggle = () => {
    setIsOpen((prevState) => !prevState); // Toggle dialog open/close
  };

  return (
    <div>
      {/* Root Dialog component that controls open state */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* Trigger button */}
        <DialogTrigger asChild>
          <button onClick={handleDialogToggle} className="btn btn-primary">
            Edit Class
          </button>
        </DialogTrigger>

        {/* Dialog Content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Make changes to your class details.
            </DialogDescription>
          </DialogHeader>

          <form>
            {/* Form content for editing the class */}
            <input type="text" placeholder="Class Name" className="input" />
            <input type="number" placeholder="Max Students" className="input" />
            {/* Add more inputs as needed */}
          </form>

          <DialogFooter>
            <DialogClose asChild>
              <button
                onClick={handleDialogToggle}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => console.log("Submit changes")}
              className="btn btn-primary"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditClassModal;
