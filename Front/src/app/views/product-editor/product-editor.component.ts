import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { Product, Variant } from '../../models/productModel';
import { Category } from '../../models/categoryModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css',
})
export class ProductEditorComponent {
  @ViewChild('imageFileInput')
  imageInputRef!: ElementRef<HTMLInputElement>;

  @Input() initialData?: Product;
  productForm!: FormGroup;
  isEditMode = false;
  availableCategories: Category[] = [];
  newCategoryName = '';
  newSubcategoryName = '';
  subcategoryList: Category[] = [];
  selectedSubcategories: string[] = [];
  products: Product[] = [];
  showEditList = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.initialData;

    this.categoryService.getAllCategory().subscribe((res: any) => {
      this.availableCategories = Array.isArray(res.categories)
        ? res.categories
        : [];
    });

    this.productForm = this.fb.group({
      name: [this.initialData?.name || '', Validators.required],
      articleCode: [this.initialData?.articleCode || '', Validators.required],
      price: [
        this.initialData?.price || 0,
        [Validators.required, Validators.min(0)],
      ],
       cost: [
        this.initialData?.price || 0,
        [ Validators.min(0)],
      ],
      description: [this.initialData?.description || ''],
      image: [this.initialData?.image?.join(', ') || '', Validators.required],
      categories: [
        this.initialData?.categories?.[0] || '',
        Validators.required,
      ],
      subcategories: [this.initialData?.subcategories || [], []],
      isActive: [this.initialData?.isActive ?? true],
      featured: [this.initialData?.featured ?? false],
      isPortfolio: [this.initialData?.isPortfolio ?? false],
      stock: [
        this.initialData?.stock || 0,
        [Validators.required, Validators.min(0)],
      ],
    });

    this.fetchProducts();
  }

  


  get variantControls(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addStock(): void {
    this.variantControls.push(
      this.fb.group({
        stock: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res;
       
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: err.message || 'No se pudieron obtener los productos.',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }

  selectForEdit(product: Product): void {
    this.initialData = product;
    this.isEditMode = true;
    this.productForm.patchValue(product);
  }

  createCategory(): void {
    if (!this.newCategoryName.trim()) return;

    const newCategory: Category = {
      name: this.newCategoryName.trim(),
      isActive: true,
    };

    this.categoryService.createCategory(newCategory).subscribe((response) => {
      this.availableCategories.push(response);
      this.productForm.get('categories')?.setValue(response._id);
      this.newCategoryName = '';
    });
  }

  addVariant(variant?: Variant): void {
    this.variantControls.push(
      this.fb.group({
        color: [variant?.color || ''],
        size: [variant?.size || ''],
        stock: [variant?.stock || 0, [Validators.min(0)]],
      })
    );
  }

  createSubcategory(): void {
    const parentId = this.productForm.get('categories')?.value;
    const name = this.newSubcategoryName.trim();

    if (!parentId || !name) return;

    const subCat: Category = {
      name,
      parent: parentId,
      isActive: true,
    };

    this.categoryService.createCategory(subCat).subscribe({
      next: (created: Category) => {
        this.subcategoryList.push(created);
        const currentSubs = this.productForm.get('subcategories')?.value || [];
        this.productForm
          .get('subcategories')
          ?.setValue([...currentSubs, created._id]);
        this.newSubcategoryName = '';

        Swal.fire({
          icon: 'success',
          title: 'Subcategoría creada',
          text: `"${created.name}" fue vinculada exitosamente.`,
          confirmButtonColor: '#d4af37',
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear subcategoría',
          text: err.error.message || 'Ocurrió un problema al guardar.',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }

  toggleEditList(): void {
  this.showEditList = !this.showEditList;
}

  getSubcategoryName(id: string): string {
    const found = this.subcategoryList.find((s) => s._id === id);
    return found?.name || 'Subcategoría';
  }

  onCategoryChange(): void {
    const selectedCatId = this.productForm.get('categories')?.value;
    this.subcategoryList = this.availableCategories.filter(
      (cat) => cat.parent === selectedCatId
    );
  }

  onSubcategoryToggle(subId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current = this.productForm.get('subcategories')?.value || [];

    if (checked) {
      this.productForm.get('subcategories')?.setValue([...current, subId]);
    } else {
      this.productForm
        .get('subcategories')
        ?.setValue(current.filter((id: string) => id !== subId));
    }
  }

  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.productForm.patchValue({ image: file });
    this.productForm.get('image')?.updateValueAndValidity();
  }
}


  onSubmit(): void {
  if (this.productForm.invalid) return;

  const raw = this.productForm.value;
  const formData = new FormData();

  // Campos simples
  formData.append('articleCode', raw.articleCode|| '');
  formData.append('name', raw.name || '');
  formData.append('price', raw.price?.toString() || '0');
  formData.append('cost', raw.cost?.toString() || '0');
  formData.append('description', raw.description || '');
  formData.append('stock', raw.stock?.toString() || '0');
  formData.append('isActive', raw.isActive ? 'true' : 'false');
  formData.append('featured', raw.featured ? 'true' : 'false');
  formData.append('isPortfolio', raw.isPortfolio ? 'true' : 'false');

  // Categorías
  const categories = Array.isArray(raw.categories) ? raw.categories : [raw.categories];
  categories.forEach((cat: string) => formData.append('categories', cat));

  // Subcategorías
  const allSubcategories = [
    ...(Array.isArray(raw.subcategories) ? raw.subcategories : []),
    ...this.selectedSubcategories,
  ];
  allSubcategories.forEach((subcat: string) => formData.append('subcategories', subcat));

  // Imagen
  if (raw.image instanceof File) {
    formData.append('image', raw.image);
  }

  console.log(formData)

  const request$ = this.isEditMode && this.initialData?._id
    ? this.productService.editProduct(this.initialData._id, formData)
    : this.productService.createProduct(formData);

  request$.subscribe({
    next: () => {
      Swal.fire({
        icon: 'success',
        title: this.isEditMode ? 'Producto editado' : 'Producto creado',
        text: this.isEditMode
          ? 'Los cambios fueron guardados correctamente.'
          : 'El producto se ha registrado exitosamente.',
        confirmButtonColor: '#d4af37',
      });

      if (!this.isEditMode) {
        this.productForm.reset({
          name: '',
          
          price: 0,
          cost:0,
          description: '',
          image: null,
          categories: '',
          subcategories: '',
          isActive: true,
          stock: 0,

          
        });
          if (this.imageInputRef?.nativeElement) {
    this.imageInputRef.nativeElement.value = '';
  }
      }
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: this.isEditMode ? 'Error al editar' : 'Error al crear',
        text: err.message || 'Hubo un problema al guardar el producto.',
        confirmButtonColor: '#d4af37',
      });
    },
  });
}

}
