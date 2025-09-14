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
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css',
})
export class ProductEditorComponent {
  /** Asegurate que en el template el input tenga #imageFileInput */
  @ViewChild('imageFileInput') imageInputRef!: ElementRef<HTMLInputElement>;

  @Input() initialData?: Product;
  productForm!: FormGroup;
  isEditMode = false;

  availableCategories: Category[] = [];
  newCategoryName = '';
  newSubcategoryName = '';
  subcategoryList: Category[] = [];
  selectedSubcategories: string[] = []; // extras marcadas manualmente
  products: Product[] = [];
  showEditList = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  private reloadSelf(): void {
  const url = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true })
    .then(() => this.router.navigateByUrl(url));
}

  ngOnInit(): void {
    this.isEditMode = !!this.initialData;

    this.categoryService.getAllCategory().subscribe((res: any) => {
      this.availableCategories = Array.isArray(res?.categories)
        ? res.categories
        : [];
    });

    this.productForm = this.fb.group({
      name: [this.initialData?.name || '', Validators.required],
      articleCode: [this.initialData?.articleCode || '', Validators.required],
      price: [
        this.initialData?.price ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      cost: [
        this.initialData?.cost ?? 0, // ✅ corregido (antes usaba price)
        [Validators.min(0)],
      ],
      description: [this.initialData?.description || ''],
      existingImages: [this.initialData?.images ?? []], // string[] (URLs/paths en server)
      images: this.fb.control<File[]>([]), // ✅ tipado correcto
      categories: [
        this.initialData?.categories?.[0] || '',
        Validators.required,
      ],
      subcategories: [this.initialData?.subcategories || []],
      isActive: [this.initialData?.isActive ?? true],
      featured: [this.initialData?.featured ?? false],
      isPortfolio: [this.initialData?.isPortfolio ?? false],
      stock: [
        this.initialData?.stock ?? 0,
        [Validators.required, Validators.min(0)],
      ],
      // ✅ inicializamos variants para que el getter no rompa
      variants: this.fb.array([] as any[]),
    });

    // Si venían variantes en initialData, las volcamos
    if (Array.isArray(this.initialData?.variants)) {
      this.initialData!.variants!.forEach((v) => this.addVariant(v));
    }

    this.fetchProducts();
  }

  /** -------- Variants -------- */
  get variantControls(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  addVariant(variant?: Variant): void {
    this.variantControls.push(
      this.fb.group({
        color: [variant?.color || ''],
        size: [variant?.size || ''],
        stock: [variant?.stock ?? 0, [Validators.min(0)]],
      })
    );
  }

  addStock(): void {
    this.variantControls.push(
      this.fb.group({
        stock: [0, [Validators.required, Validators.min(0)]],
      })
    );
  }

  /** -------- Productos existentes (listado/edición) -------- */
  fetchProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res ?? [];
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err?.message);
        Swal.fire({
          icon: 'error',
          title: 'Error de carga',
          text: err?.message || 'No se pudieron obtener los productos.',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }

  selectForEdit(product: Product): void {
    this.initialData = product;
    this.isEditMode = true;

    // Cargar valores base
    this.productForm.patchValue({
      name: product.name ?? '',
      articleCode: product.articleCode ?? '',
      price: product.price ?? 0,
      cost: product.cost ?? 0,
      description: product.description ?? '',
      existingImages: product.images ?? [],
      images: [], // no arrastramos Files previos
      categories: product.categories?.[0] || '',
      subcategories: product.subcategories ?? [],
      isActive: product.isActive ?? true,
      featured: product.featured ?? false,
      isPortfolio: product.isPortfolio ?? false,
      stock: product.stock ?? 0,
    });

    // Variants: reseteamos y cargamos
    this.variantControls.clear();
    if (Array.isArray(product.variants)) {
      product.variants.forEach((v) => this.addVariant(v));
    }

    this.onCategoryChange(); // actualiza subcategorías según categoría
    this.clearImages(); // limpia input file
  }

  toggleEditList(): void {
    this.showEditList = !this.showEditList;
  }

  /** -------- Categorías / Subcategorías -------- */
  createCategory(): void {
  const name = this.newCategoryName.trim();
  if (!name) return;

  const newCategory: Category = { name, isActive: true };

  this.categoryService.createCategory(newCategory).subscribe({
    next: (response) => {
      // Actualizo estado actual por si NO querés redirigir
      this.availableCategories.push(response);
      this.productForm.get('categories')?.setValue(response._id);
      this.newCategoryName = '';

      // ✅ redirección suave al mismo componente
      this.reloadSelf();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear categoría',
        text: err?.error?.message || 'Ocurrió un problema al guardar.',
        confirmButtonColor: '#d4af37',
      });
    }
  });
}


createSubcategory(): void {
  const parentId = this.productForm.get('categories')?.value;
  const name = this.newSubcategoryName.trim();
  if (!parentId || !name) return;

  const subCat: Category = { name, parent: parentId, isActive: true };

  this.categoryService.createCategory(subCat).subscribe({
    next: (created: Category) => {
      // Actualizo estado actual por si NO querés redirigir
      this.subcategoryList.push(created);
      const currentSubs: string[] = this.productForm.get('subcategories')?.value || [];
      this.productForm.get('subcategories')?.setValue([...currentSubs, created._id]);
      this.newSubcategoryName = '';

      Swal.fire({
        icon: 'success',
        title: 'Subcategoría creada',
        text: `"${created.name}" fue vinculada exitosamente.`,
        confirmButtonColor: '#696763ff',
      });

      // ✅ redirección suave al mismo componente
      this.reloadSelf();
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error al crear subcategoría',
        text: err?.error?.message || 'Ocurrió un problema al guardar.',
        confirmButtonColor: '#d4af37',
      });
    },
  });
}

  onCategoryChange(): void {
    const selectedCatId = this.productForm.get('categories')?.value;

    if (!selectedCatId) {
      this.subcategoryList = [];
      this.productForm.get('subcategories')?.setValue([]);
      return;
    }

    this.categoryService.getSubcategories(selectedCatId).subscribe({
      next: (res) => {
        this.subcategoryList = Array.isArray(res?.subcategories)
          ? res.subcategories
          : [];
      },
      error: (err) => {
        console.error('❌ Error al cargar subcategorías:', err?.message);
        this.subcategoryList = [];
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar subcategorías',
          text: err?.message || 'No se pudieron obtener las subcategorías.',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }

  onSubcategoryToggle(subId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current: string[] =
      this.productForm.get('subcategories')?.value || [];
    if (checked) {
      this.productForm.get('subcategories')?.setValue([...current, subId]);
    } else {
      this.productForm
        .get('subcategories')
        ?.setValue(current.filter((id) => id !== subId));
    }
  }

  getSubcategoryName(id: string): string {
    const found = this.subcategoryList.find((s) => s._id === id);
    return found?.name || 'Subcategoría';
  }

  /** -------- Imágenes (input file + control) -------- */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const files = Array.from(input.files);
      this.productForm.get('images')?.setValue(files); // File[]
      this.productForm.get('images')?.updateValueAndValidity();
    } else {
      this.productForm.get('images')?.setValue([]);
    }
  }

  private clearImages(): void {
    const ctrl = this.productForm.get('images');
    ctrl?.setValue([]);
    ctrl?.markAsPristine();
    ctrl?.markAsUntouched();

    if (this.imageInputRef?.nativeElement) {
      this.imageInputRef.nativeElement.value = ''; // limpia el input real
    }
  }

  /** -------- Submit -------- */
  onSubmit(): void {
    if (this.productForm.invalid) return;

    const raw = this.productForm.value as any;
    const formData = new FormData();

    // Campos simples
    formData.append('articleCode', raw.articleCode || '');
    formData.append('name', raw.name || '');
    formData.append('price', (raw.price ?? 0).toString());
    formData.append('cost', (raw.cost ?? 0).toString());
    formData.append('description', raw.description || '');
    formData.append('stock', (raw.stock ?? 0).toString());
    formData.append('isActive', raw.isActive ? 'true' : 'false');
    formData.append('featured', raw.featured ? 'true' : 'false');
    formData.append('isPortfolio', raw.isPortfolio ? 'true' : 'false');

    // Categorías (server puede esperar array)
    const categories = Array.isArray(raw.categories)
      ? raw.categories
      : [raw.categories];
    categories
      .filter(Boolean)
      .forEach((cat: string) => formData.append('categories', cat));

    // Subcategorías: combinamos control + seleccionadas manuales
    const allSubcategories: string[] = [
      ...(Array.isArray(raw.subcategories) ? raw.subcategories : []),
      ...this.selectedSubcategories,
    ].filter(Boolean);
    allSubcategories.forEach((subcat: string) =>
      formData.append('subcategories', subcat)
    );

    // Imágenes existentes (mantener)
    formData.append('existingImages', JSON.stringify(raw.existingImages || []));

    // Nuevos archivos
    const newFiles: File[] = Array.isArray(raw.images) ? raw.images : [];
    newFiles.forEach((file: File) => formData.append('images', file));

    // Loader
    Swal.fire({
      title: this.isEditMode
        ? 'Guardando cambios...'
        : 'Registrando producto...',
      html: 'Por favor espera un momento.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      },
    });

    const request$ =
      this.isEditMode && this.initialData?._id
        ? this.productService.editProductSmart(this.initialData._id, formData)
        : this.productService.createProduct(formData);

    request$.subscribe({
      next: () => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Producto editado' : 'Producto creado',
          text: this.isEditMode
            ? 'Los cambios fueron guardados correctamente.'
            : 'El producto se ha registrado exitosamente.',
          confirmButtonColor: '#d4af37',
        });
        this.reloadSelf();
      },
      error: (err) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: this.isEditMode ? 'Error al editar' : 'Error al crear',
          text: err?.message || 'Hubo un problema al guardar el producto.',
          confirmButtonColor: '#d4af37',
        });
      },
    });
  }
}
