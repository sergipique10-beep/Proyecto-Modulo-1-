import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';

const STORAGE_KEY = 'pedidos';

interface Chuleton {
  id: number;
  tipo: string;
  origen: string;
  peso: number;
  maduracion: number;
  cantidad: number;
}

@Component({
  selector: 'app-lista-pedidos',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './lista-pedidos.html',
  styleUrl: './lista-pedidos.scss',
})
export class ListaPedidos {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private nextId = 1;

  form = this.fb.group({
    tipo:       ['', Validators.required],
    origen:     ['', Validators.required],
    peso:       [null as number | null, [Validators.required, Validators.min(0.1)]],
    maduracion: [null as number | null, [Validators.required, Validators.min(0)]],
    cantidad:   [1,                     [Validators.required, Validators.min(1)]],
  });

  pedidos = signal<Chuleton[]>(this.cargarDesdeStorage());

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pedidos()));
    });
  }

  private cargarDesdeStorage(): Chuleton[] {
    try {
      const datos = localStorage.getItem(STORAGE_KEY);
      if (!datos) return [];
      const lista: Chuleton[] = JSON.parse(datos);
      this.nextId = lista.length > 0 ? Math.max(...lista.map(p => p.id)) + 1 : 1;
      return lista;
    } catch {
      return [];
    }
  }

  totalKg = computed(() =>
    this.pedidos().reduce((acc, p) => acc + p.peso * p.cantidad, 0)
  );

  totalUnidades = computed(() =>
    this.pedidos().reduce((acc, p) => acc + p.cantidad, 0)
  );

  get tipo()       { return this.form.get('tipo'); }
  get origen()     { return this.form.get('origen'); }
  get peso()       { return this.form.get('peso'); }
  get maduracion() { return this.form.get('maduracion'); }
  get cantidad()   { return this.form.get('cantidad'); }

  agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.pedidos.update(list => [
      ...list,
      {
        id:         this.nextId++,
        tipo:       v.tipo!,
        origen:     v.origen!,
        peso:       v.peso!,
        maduracion: v.maduracion!,
        cantidad:   v.cantidad!,
      },
    ]);
    this.form.reset({ cantidad: 1 });
  }

  eliminar(id: number): void {
    this.pedidos.update(list => list.filter(p => p.id !== id));
  }

  vaciarCarrito(): void {
    this.pedidos.set([]);
  }

  cerrarSesion(): void {
    this.authService.logout().then(() => this.router.navigate(['/register']));
  }
}
