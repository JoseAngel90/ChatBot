import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'https://api.spoonacular.com/recipes/findByIngredients';
  private apiKey = '7c6038878c7b4efd845a657eaf4975e6'; 

  constructor(private http: HttpClient) {}

  getRecipes(ingredients: string[]): Observable<any> {
    const params = new HttpParams()
      .set('ingredients', ingredients.join(','))
      .set('number', '1')  
      .set('apiKey', this.apiKey);

    return this.http.get(this.apiUrl, { params });
  }
  getRecipeDetails(recipeId: number): Observable<any> {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information`;
    let params = new HttpParams().set('apiKey', this.apiKey);

    return this.http.get(url, { params });
  }
}
