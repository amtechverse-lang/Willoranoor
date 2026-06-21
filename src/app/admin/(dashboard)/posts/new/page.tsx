import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold">New Post</h1>
      <PostForm />
    </div>
  );
}
