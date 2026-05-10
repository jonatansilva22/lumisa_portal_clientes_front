import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../../../shared/ui/Input";
import { Textarea } from "../../../shared/ui/Textarea";
import { Select } from "../../../shared/ui/Select";
import { FileUpload } from "../../../shared/ui/FileUpload";
import { Button } from "../../../shared/ui/Button";
import type { Product, ProductType, Unit } from "../types/product";

type ProductFormProps = {
	initialData?: Partial<Product>;
	types: ProductType[];
	units: Unit[];
	onSubmit: (data: FormData) => void;
	onCancel: () => void;
	loading?: boolean;
};

export function ProductForm({ initialData = {}, types, units, onSubmit, onCancel, loading }: ProductFormProps) {
	const { register, handleSubmit, setValue, watch, reset, control, formState: { errors } } = useForm({
		defaultValues: {
			name: initialData.name || "",
			description: initialData.description || "",
			price: initialData.price || 0,
			quantity: initialData.quantity || 0,
			type_id: initialData.type_id ? String(initialData.type_id) : "",
			unit_id: initialData.unit_id ? String(initialData.unit_id) : "",
			active: initialData.active ?? true,
			image: null as File | null,
		},
		mode: "onBlur"
	});

	// Si cambia initialData, resetea el form
	useEffect(() => {
		reset({
			name: initialData.name || "",
			description: initialData.description || "",
			price: initialData.price !== undefined && initialData.price !== null ? Number(initialData.price) : 0,
			quantity: initialData.quantity !== undefined && initialData.quantity !== null ? Number(initialData.quantity) : 0,
			type_id: initialData.type_id ? String(initialData.type_id) : "",
			unit_id: initialData.unit_id ? String(initialData.unit_id) : "",
			active: initialData.active ?? true,
			image: null,
		});
	}, [initialData, reset]);

	const image = watch("image");

	const handleFormSubmit = (data: any) => {
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("description", data.description || "");
		formData.append("price", data.price);
		formData.append("quantity", data.quantity);
		formData.append("type_id", data.type_id);
		formData.append("unit_id", data.unit_id);
		formData.append("active", data.active ? "true" : "false");
		if (data.image) formData.append("image", data.image);
		// Nunca enviar type ni unit como objeto
		onSubmit(formData);
	};

	return (
		   <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3">
			   <div>
				   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
				   <Input
					   id="name"
					   {...register("name", {
						   required: "Nombre requerido",
						   minLength: { value: 2, message: "El nombre es muy corto (mínimo 2 caracteres)" },
						   maxLength: { value: 50, message: "El nombre es muy largo (máximo 50 caracteres)" }
					   })}
					   placeholder="Nombre del producto"
					   disabled={loading}
				   />
				   {errors.name && <span className="text-red-500 text-base font-medium">{String(errors.name.message)}</span>}
			   </div>

			   <div>
				   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
				   <Textarea
					   id="description"
					   {...register("description")}
					   placeholder="Descripción"
					   rows={3}
					   disabled={loading}
				   />
			   </div>

			   <div className="flex gap-2">
				   <div className="flex-1">
						<label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
							<Input
								id="price"
								type="number"
								step="0.01"
								{...register("price", {
									required: "Precio requerido",
									min: { value: 0.01, message: "El precio debe ser mayor a 0" },
									max: { value: 999999.99, message: "El precio es demasiado alto" },
									valueAsNumber: true
								})}
								placeholder="Precio"
								disabled={loading}
							/>
							{errors.price && <span className="text-red-500 text-base font-medium">{String(errors.price.message)}</span>}
				   </div>
				   <div className="flex-1">
						<label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
							<Input
								id="quantity"
								type="number"
								{...register("quantity", {
									required: "Cantidad requerida",
									min: { value: 0, message: "La cantidad no puede ser negativa" },
									max: { value: 999999, message: "La cantidad es demasiado alta" },
									valueAsNumber: true
								})}
								placeholder="Cantidad"
								disabled={loading}
							/>
							{errors.quantity && <span className="text-red-500 text-base font-medium">{String(errors.quantity.message)}</span>}
				   </div>
			   </div>

			   <div className="flex gap-2">
				   <div className="flex-1">
					   <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">Tipo de producto</label>
					<Controller
						name="type_id"
						control={control}
						rules={{ required: "El tipo de producto es obligatorio" }}
						render={({ field }) => (
							<Select
								value={field.value}
								onChange={field.onChange}
								options={types.map(t => ({ value: String(t.id), label: t.name }))}
								placeholder="Tipo de producto"
								className="w-full"
							/>
						)}
					/>
					{errors.type_id && <span className="text-red-500 text-base font-medium">{String(errors.type_id.message)}</span>}
				   </div>
				   <div className="flex-1">
					   <label htmlFor="unit_id" className="block text-sm font-medium text-gray-700 mb-1">Unidad</label>
					<Controller
						name="unit_id"
						control={control}
						rules={{ required: "La unidad es obligatoria" }}
						render={({ field }) => (
							<Select
								value={field.value}
								onChange={field.onChange}
								options={units.map(u => ({ value: String(u.id), label: u.abbreviation || u.name }))}
								placeholder="Unidad"
								className="w-full"
							/>
						)}
					/>
					{errors.unit_id && <span className="text-red-500 text-base font-medium">{String(errors.unit_id.message)}</span>}
				   </div>
			   </div>

			   <div className="flex items-center gap-3 mt-2">
				   <label htmlFor="active" className="text-gm font-medium text-gray-700 select-none cursor-pointer flex items-center">
					   <span className="mr-2">Activo</span>
					   <span className="relative inline-block w-11 h-6 align-middle select-none">
						   <input
							   id="active"
							   type="checkbox"
							   {...register("active")}
							   checked={watch("active")}
							   disabled={loading}
							   className="sr-only peer"
						   />
						   <span className="block bg-gray-300 peer-checked:bg-blue-500 w-11 h-6 rounded-full transition-colors duration-200"></span>
						   <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-200 peer-checked:translate-x-5"></span>
					   </span>
				   </label>
			   </div>

			   <div>
				   
				   <FileUpload
					   label="Imagen"
					   value={image}
					   onChange={file => setValue("image", file)}
					   accept="image/*"
					   className="mt-2"
				   />
			   </div>

			   <div className="flex justify-end gap-2 mt-4">
				   <Button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-400">Cancelar</Button>
				   <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold">
					   {loading ? "Guardando..." : "Guardar"}
				   </Button>
			   </div>
		   </form>
	);
}
