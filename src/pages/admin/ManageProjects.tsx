import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { projects as initialProjects } from "@/data/mockData";

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  year: number;
  category: string;
  specs: string[];
  gallery: string[];
}

const ManageProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    fullDescription: "",
    image: "/placeholder.svg",
    year: new Date().getFullYear(),
    category: "",
    specs: [],
    gallery: [],
  });
  const [specsInput, setSpecsInput] = useState("");

  const handleAdd = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      fullDescription: "",
      image: "/placeholder.svg",
      year: new Date().getFullYear(),
      category: "",
      specs: [],
      gallery: [],
    });
    setSpecsInput("");
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setSpecsInput(project.specs.join("\n"));
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast.success("تم حذف المشروع بنجاح");
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const specs = specsInput.split("\n").filter((s) => s.trim() !== "");

    if (editingProject) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id
            ? { ...formData, specs, id: p.id } as Project
            : p
        )
      );
      toast.success("تم تحديث المشروع بنجاح");
    } else {
      const newProject = {
        ...formData,
        specs,
        id: Date.now().toString(),
      } as Project;
      setProjects([...projects, newProject]);
      toast.success("تم إضافة المشروع بنجاح");
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              العودة للوحة التحكم
            </Button>
            <h1 className="text-lg font-bold">إدارة المشاريع</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>قائمة المشاريع</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة مشروع جديد
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العنوان</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead className="text-center">السنة</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead className="text-left">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell className="text-center">{project.year}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {project.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "تعديل مشروع" : "إضافة مشروع جديد"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "قم بتعديل بيانات المشروع"
                : "قم بإدخال بيانات المشروع الجديد"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">عنوان المشروع *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="سيارة السباق QR-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">الفئة *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="سيارات السباق"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">السنة *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">الوصف المختصر *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="وصف مختصر للمشروع"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullDescription">الوصف الكامل</Label>
              <Textarea
                id="fullDescription"
                value={formData.fullDescription}
                onChange={(e) =>
                  setFormData({ ...formData, fullDescription: e.target.value })
                }
                placeholder="وصف تفصيلي كامل للمشروع"
                rows={5}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specs">المواصفات (كل مواصفة في سطر)</Label>
              <Textarea
                id="specs"
                value={specsInput}
                onChange={(e) => setSpecsInput(e.target.value)}
                placeholder="محرك: 4 أسطوانات، 2.0 لتر، توربو&#10;القوة: 350 حصان&#10;السرعة القصوى: 280 كم/ساعة"
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProjects;
