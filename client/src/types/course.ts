export interface Course {
  idtest_courses?: number;
  course_name: string;
  difficulty: number;
  hours_of_work: number;
  utility: number;
  professor: string;
  test_coursescol: string;
}

export type CreateCourseDTO = Omit<Course, 'idtest_courses'>;
export type UpdateCourseDTO = Partial<CreateCourseDTO>;
