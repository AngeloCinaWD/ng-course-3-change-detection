import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  InjectionToken,
  OnInit,
  Optional,
  QueryList,
  Self,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { COURSES } from "../db-data";
import { Course } from "./model/course";
import { CourseCardComponent } from "./course-card/course-card.component";
import { HighlightedDirective } from "./directives/highlighted.directive";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CoursesService } from "./services/courses.service";
import { APP_CONFIG, AppConfig, CONFIG_TOKEN } from "./configurazioniApp";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  courses: Course[] = COURSES;

  courses$: Observable<Course[]>;

  coursesService$: Observable<Course[]>;

  constructor(
    private http: HttpClient,
    @Optional() private coursesService: CoursesService,
    @Inject(CONFIG_TOKEN) private configObject: AppConfig
  ) {
    console.log(configObject);
  }

  ngOnInit() {
    const params = new HttpParams().set("page", "1").set("pageSize", "10");

    this.http
      .get<Course[]>("/api/courses", { params: params })
      .subscribe((valore) => {
        console.log(valore);
        this.courses = valore;
      });

    this.courses$ = this.http.get<Course[]>("/api/courses", { params: params });

    this.coursesService$ = this.coursesService.loadCourses();
  }

  onCourseChanged(course: Course) {
    this.coursesService
      .saveCourse(course)
      .subscribe((value) => console.log(value.description));
  }
}
