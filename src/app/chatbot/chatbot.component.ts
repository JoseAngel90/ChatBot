import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  messages: { text: string, isUser: boolean }[] = [];
  userInput: string = '';

  constructor(private recipeService: RecipeService) {}

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, isUser: true });
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
            },
            error => {
              this.messages.push({ text: 'No se encontraron detalles de la receta. Inténtalo de nuevo.', isUser: false });
            }
          );
        });
      },
      error => {
        this.messages.push({ text: 'No se encontraron recetas. Inténtalo de nuevo.', isUser: false });
      }
    );
  }
}
