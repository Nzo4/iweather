import { Component, OnInit } from "@angular/core";
import { WeatherService } from "../../services/weather.service";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, Subject, switchMap } from "rxjs";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Location } from "src/app/constants/weather";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.scss'],
  imports: [FormsModule, CommonModule]
})

export class HomeComponent implements OnInit {
  locationName: string = '';
  currentlocations: Location[] = [];
  latitudeLocation: string = '';
  longitudeLocation: string = '';

  locationName$: Subject<string> = new Subject<string>();

  constructor(private weatherService: WeatherService, private router: Router) { }

  ngOnInit(): void {
    this.checkedLocationName()
  }

  suggestLocation(locationName: string) {
    this.locationName$.next(locationName);
  }

  checkedLocationName() {
    this.locationName$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(locationName => locationName !== ''),
      switchMap(locationName => this.weatherService.findLocation(locationName))
    ).subscribe({
      next: (response) => {
        this.currentlocations = response;
      },
      error: (error) => console.log(error)
    });
  }

  getWeatherPlan(cityName: string) {
    const { lat, lon } = this.currentlocations[0];
    this.locationName = cityName;
    this.router.navigate(['/dashboard'], { queryParams: { address: this.locationName, lat: lat, lon: lon } })
  }
}
