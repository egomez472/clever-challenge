import { computed, Directive, effect, EffectRef, inject, Input, OnDestroy, OnInit, runInInjectionContext, Signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserStore } from '../store/user.store';
import { User } from '../../api/models/User.model';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class RolesDirective implements OnInit, OnDestroy {
  @Input('hasRole') roles? : (string | null)[];

  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly userStore = inject(UserStore)

  private effectRef!: EffectRef;
  private isViewCreated = false;

  ngOnInit(): void {
    this.effectRef = runInInjectionContext(this.viewContainerRef.injector, () => {
      return effect(() => {
        const user = this.userStore.userSignal();
        this.updateView(user());
      });
    });
  }

  private updateView(user: User | null): void {
    const hasRole = Boolean(user && this.roles?.includes(user.rol));

    if (hasRole && !this.isViewCreated) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      this.isViewCreated = true;
    } else if (!hasRole && this.isViewCreated) {
      this.viewContainerRef.clear();
      this.isViewCreated = false;
    }
  }

  ngOnDestroy(): void {
    this.effectRef?.destroy();
  }

}
