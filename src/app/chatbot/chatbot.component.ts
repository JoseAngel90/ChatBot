import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewInit, OnInit {
  messages: { text: string, isUser: boolean }[] = [];
  userInput: string = '';

  private userSound: HTMLAudioElement | null = null;
  private botSound: HTMLAudioElement | null = null;
  private videoElement: HTMLVideoElement | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.sendWelcomeMessage(); // Enviar mensaje de bienvenida al iniciar
  }

  ngAfterViewInit(): void {
    // Inicializar los elementos de audio y video
    this.userSound = document.getElementById('user-sound') as HTMLAudioElement;
    this.botSound = document.getElementById('bot-sound') as HTMLAudioElement;
    this.videoElement = document.querySelector('video') as HTMLVideoElement;

    // Ajustar el volumen del audio al 25% (0.25)
    if (this.userSound) {
      this.userSound.volume = 0.25;
    }
    if (this.botSound) {
      this.botSound.volume = 0.25;
    }

    // Ajustar el volumen del video al 9% (0.09)
    if (this.videoElement) {
      this.videoElement.volume = 0.09;
    }
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, isUser: true });
      this.playUserSound();
      this.getRecipes(this.userInput);
      this.userInput = '';
    }
  }

  getRecipes(input: string) {
    const ingredients = input.split(',').map(ing => ing.trim());
    this.recipeService.getRecipes(ingredients).subscribe(
      recipes => {
        recipes.forEach((recipe: any) => {
          this.recipeService.getRecipeDetails(recipe.id).subscribe(
            recipeDetails => {
              const usedIngredients = recipeDetails.extendedIngredients.map((ingredient: any) => ingredient.original).join(', ');
              const missingIngredients = recipe.missedIngredients.map((ingredient: any) => ingredient.original).join(', ');
              const recipeSteps = recipeDetails.analyzedInstructions[0]?.steps.map((step: any) => step.step).join('<br>');

              const message = `Receta: ${recipe.title}<br>`
                            + `Ingredientes usados: ${usedIngredients}<br><br>`
                            + `Ingredientes faltantes: ${missingIngredients}<br><br>`
                            + `Pasos:<br>${recipeSteps}`;

              this.messages.push({ text: message, isUser: false });
              this.playBotSound(); // Reproduce el sonido cuando el bot responde
            },
            
          );
        });
      },
     
    );
  }

  private playUserSound(): void {
    if (this.userSound) {
      this.userSound.play();
    }
  }

  private playBotSound(): void {
    if (this.botSound) {
      this.botSound.play();
    }
  }

  private sendWelcomeMessage(): void {
    const welcomeMessage = '¡Hola! Bienvenido a RecetasOnline. ¿Qué te gustaría cocinar hoy?';
    this.messages.push({ text: welcomeMessage, isUser: false });
    this.suggestRecipe();
  }

  private suggestRecipe(): void {
    const recipeSuggestion = '¿Qué ingredientes tienes para cocinar hoy?';
    this.messages.push({ text: recipeSuggestion, isUser: false });
  }
}
