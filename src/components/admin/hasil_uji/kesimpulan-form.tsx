import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "../../ui/field";
import { Button } from "../../ui/button";
import { EditSampel, EditSampelSchema } from "@/lib/schemas/sampel";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface KesimpulanFormProps {
  defaultValue?: Partial<EditSampel>;
  onSubmit: (data: EditSampel) => void;
  id: number
  loading?: boolean;
}

export default function KesimpulanForm({ defaultValue, onSubmit, loading, id }: KesimpulanFormProps) {
  const form = useForm<EditSampel>({
    resolver: zodResolver(EditSampelSchema),
    defaultValues: {
      id: id,
      kesimpulan: "",
      ...defaultValue,
    },
  });

  const handleSubmit = (data: EditSampel) => {
    onSubmit(data);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FieldGroup>
          {/* Kesimpulan Field */}
          <Controller
            name="id"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="id"></FieldLabel>
                <Input {...field} id="id" value={field.value} hidden/>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="kesimpulan"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="kesimpulan">Kesimpulan</FieldLabel>
                <Textarea {...field} id="kesimpulan" value={field.value ?? ""} placeholder="Kesimpulan pengujian sampel" />
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          {/* Submit Button */}
          <Field>
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
            <FieldDescription className="text-center text-gray-500">Isi kesimpulan pengujian</FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
