import * as React from "react";
import { Check, ChevronsUpDown, Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ProfessionalMemberSelect({ members, formData, setFormData }) {
  const [open, setOpen] = React.useState(false);
  console.log(members)

  // العثور على العضو المختار حالياً
  const selectedMember = members.find((m) => m.memberId === formData.memberId);

  return (
    <div className="grid gap-2 text-right" dir="rtl">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        اختر العضو المسجل <span className="text-destructive">*</span>
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 px-3 border-slate-200 hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="flex items-center gap-3">
              {selectedMember ? (
                <>
                  <Avatar className="h-7 w-7 border">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {selectedMember.memberName.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-slate-900">{selectedMember.memberName}</span>
                </>
              ) : (
                <span className="text-muted-foreground text-sm">ابحث عن اسم العضو هنا...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command className="rounded-lg">
            <div className="flex items-center border-b px-3" dir="rtl">
              <CommandInput 
                placeholder="اكتب اسم العضو للبحث..." 
                className="h-11 bg-transparent outline-none border-none focus:ring-0"
              />
            </div>
            
            <CommandList>
              <CommandEmpty className="py-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">هذا العضو غير موجود بقاعدة البيانات.</p>
                <Button variant="outline" size="sm" className="gap-2">
                   <UserPlus className="h-4 w-4" /> إضافة عضو جديد
                </Button>
              </CommandEmpty>

              <CommandGroup heading="الأعضاء المسجلين">
                {members.map((m) => (
                  <CommandItem
                    key={m.memberId}
                    value={m.memberName}
                    onSelect={() => {
                      setFormData({ ...formData, memberId: m.memberId });
                      setOpen(false);
                    }}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-slate-100 text-[10px]">
                        {m.memberName.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col flex-1">
                       <span className="font-medium">{m.memberName}</span>
                       <span className="text-[11px] text-muted-foreground">{m.role}</span>
                    </div>

                    <Check
                      className={cn(
                        "h-4 w-4 text-primary",
                        formData.memberId === m.memberId ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}