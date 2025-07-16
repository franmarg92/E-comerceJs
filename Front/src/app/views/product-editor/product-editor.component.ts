import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Product, Variant } from '../../models/productModel';
import { Category } from '../../models/categoryModel';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css'
})
export class ProductEditorComponent {
@Input() initialData?: Product;
  productForm!: FormGroup;
  isEditMode = false;
  availableCategories: Category[] = [];
  newCategoryName = '';

  constructor(private fb: FormBuilder, private productService: ProductService, private categoryService: CategoryService) {}

ngOnInit(): void {
  this.isEditMode = !!this.initialData;
 this.categoryService.getAllCategory().subscribe((res: any) => {
  this.availableCategories = Array.isArray(res.categories) ? res.categories : [];
});

 this.productForm = this.fb.group({
  name: [this.initialData?.name || '', Validators.required],
  price: [this.initialData?.price || 0, [Validators.required, Validators.min(0)]],
  description: [this.initialData?.description || ''],
  image: [this.initialData?.image?.join(', ') || '', Validators.required],
  categories: [this.initialData?.categories?.[0] || '', Validators.required],
  isActive: [this.initialData?.isActive ?? true],
  stock: [this.initialData?.stock || 0, [Validators.required, Validators.min(0)]]
});




  
 this.categoryService.getAllCategory().subscribe((res: any) => {
  this.availableCategories = Array.isArray(res.categories) ? res.categories : [];


 
});
}

addStock(): void {
  this.variantControls.push(
    this.fb.group({
      stock: [0, [Validators.required, Validators.min(0)]]
    })
  );
}

createCategory(): void {
  if (!this.newCategoryName.trim()) return;

  const newCategory: Category = { name: this.newCategoryName.trim(), isActive: true };
  this.categoryService.createCategory(newCategory).subscribe(response => {
    this.availableCategories.push(response);
    this.productForm.get('categories')?.value.push(response._id);
    this.newCategoryName = '';
  });
}


  get variantControls(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant(variant?: Variant): void {
    this.variantControls.push(this.fb.group({
      color: [variant?.color || ''],
      size: [variant?.size || ''],
      stock: [variant?.stock || 0, [Validators.min(0)]]
    }));
  }

onSubmit(): void {
  if (this.productForm.invalid) return;

  const formData = { ...this.productForm.value };

  formData.image = formData.image
    .split(',')
    .map((url: string) => url.trim());

  formData.categories = Array.isArray(formData.categories)
    ? formData.categories
    : [formData.categories];

  console.log('📦 Payload corregido a enviar:', formData);

  if (this.isEditMode) {
    this.productService.editProduct(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Producto editado',
          text: 'Los cambios fueron guardados correctamente.',
          confirmButtonColor: '#d4af37'
        });
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error al editar',
          text: err.message || 'No se pudo guardar el producto.',
          confirmButtonColor: '#d4af37'
        });
      }
    });
  } else {
    this.productService.createProduct(formData).subscribe({
      next: res => {
        console.log('✅ Producto creado:', res);

        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto se ha registrado exitosamente.',
          confirmButtonColor: '#d4af37'
        });

        this.productForm.reset({
          name: '',
          price: 0,
          description: '',
          image: '',
          categories: '',
          isActive: true,
          stock: 0
        });
      },
      error: err => {
        console.error('❌ Error al crear producto:', err.message);

        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: err.message || 'No se pudo crear el producto.',
          confirmButtonColor: '#d4af37'
        });
      }
    });
  }
}



}

