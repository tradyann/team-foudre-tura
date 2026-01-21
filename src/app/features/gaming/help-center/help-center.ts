import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../user/user.service';
// import { AiHelpService } from './ai-help.service';

@Component({
  selector: 'app-help-center',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './help-center.html',
  styleUrl: './help-center.css'
})
export class HelpCenter {
  private fb = inject(FormBuilder);
  userService = inject(UserService);
  //private ai = inject(AiHelpService);

  // Config
  readonly maxChars = 200;
  readonly supportEmail = 'team@turaracing.com';
  readonly discordInvite = 'https://discord.gg/yourInviteCode';

  // UI state
  loading = signal(false);
  error = signal<string | null>(null);
  aiAnswer = signal<string | null>(null);
  chatResponse: string | null = null;

  // Form
  form = this.fb.group({
    q: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxChars)],
      updateOn: 'change' // évalue dès la 1re saisie
    })
  });

  canAsk = computed(() => !this.loading() && this.form.valid);
  charsLeft = computed(() => this.maxChars - (this.form.value.q?.length ?? 0));

  ask(e?: Event) {
    e?.preventDefault();
    this.chatResponse = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const query = this.form.value.q?.trim();
    if (!query) return;

    this.loading.set(true);
    this.userService.getChatbot(query).subscribe({
      next: (response) => {
        if (response.choices?.length) {
          this.aiAnswer.set(response.choices[0].message.content);
        } else {
          this.aiAnswer.set("No answer available. Please try again or contact support.");
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.aiAnswer.set("Error fetching answer. Please contact support.");
        this.loading.set(false);
      }
    });
  }

  // Keyboard: Ctrl/Cmd+Enter
  onKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.ask(event);
    }
  }

  clear() {
    this.form.reset();
    this.chatResponse = null;
    this.form.controls.q.markAsPristine();
    this.form.controls.q.markAsUntouched();
  }

}