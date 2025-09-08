# ADR-0003 Instructor Dashboard REST API Architecture

## Decision
Implement unified Instructor Dashboard REST API with service orchestration pattern organizing 90 endpoints across 12 functional domains.

## API Endpoints & Services

### Course Information API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/info` | instructor, xmodule.modulestore |
| PUT | `/api/instructor/v1/courses/{course_key}/info` | instructor, xmodule.modulestore |
| GET | `/api/instructor/v1/courses/{course_key}/instructor_tasks` | instructor_task |
| GET | `/api/instructor/v1/courses/{course_key}/modes` | course_modes |
| PUT | `/api/instructor/v1/courses/{course_key}/modes/{mode_id}/price` | course_modes |

### Membership Management API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/enrollment` | enrollments, student |
| POST | `/api/instructor/v1/courses/{course_key}/enrollment` | enrollments, student |
| DELETE | `/api/instructor/v1/courses/{course_key}/enrollment` | enrollments, student |
| POST | `/api/instructor/v1/courses/{course_key}/enrollment/batch` | bulk_enroll, bulk_email |
| POST | `/api/instructor/v1/courses/{course_key}/enrollment/csv_upload` | bulk_enroll, util |
| GET | `/api/instructor/v1/courses/{course_key}/roles` | student.auth |
| POST | `/api/instructor/v1/courses/{course_key}/roles` | student.auth |
| DELETE | `/api/instructor/v1/courses/{course_key}/roles` | student.auth |
| GET | `/api/instructor/v1/courses/{course_key}/roles/{role_type}/members` | student.auth |
| GET | `/api/instructor/v1/courses/{course_key}/beta_testers` | student.auth |
| POST | `/api/instructor/v1/courses/{course_key}/beta_testers` | student.auth |
| DELETE | `/api/instructor/v1/courses/{course_key}/beta_testers` | student.auth |
| GET | `/api/instructor/v1/courses/{course_key}/forum/members` | discussion, student.auth |
| POST | `/api/instructor/v1/courses/{course_key}/forum/members` | discussion, student.auth |
| DELETE | `/api/instructor/v1/courses/{course_key}/forum/members` | discussion, student.auth |

### Student Administration API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/students` | student, instructor |
| GET | `/api/instructor/v1/courses/{course_key}/students/{username}` | student, instructor |
| GET | `/api/instructor/v1/courses/{course_key}/students/{username}/enrollment_status` | enrollments |
| GET | `/api/instructor/v1/courses/{course_key}/students/{username}/progress_url` | student, instructor |
| POST | `/api/instructor/v1/courses/{course_key}/students/{username}/reset_attempts` | grades, xmodule.modulestore, instructor_task |
| POST | `/api/instructor/v1/courses/{course_key}/students/{username}/reset_entrance_exam` | grades, xmodule.modulestore |
| POST | `/api/instructor/v1/courses/{course_key}/students/{username}/rescore_problem` | grades, xmodule.modulestore, instructor_task |
| POST | `/api/instructor/v1/courses/{course_key}/students/{username}/override_score` | grades, xmodule.modulestore |
| POST | `/api/instructor/v1/courses/{course_key}/students/{username}/delete_state` | student, xmodule.modulestore |
| POST | `/api/instructor/v1/courses/{course_key}/problems/{problem_id}/reset_attempts_all` | grades, xmodule.modulestore, instructor_task |
| POST | `/api/instructor/v1/courses/{course_key}/problems/{problem_id}/rescore_all` | grades, xmodule.modulestore, instructor_task |

### Cohort Management API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/cohorts` | openedx.core.djangoapps.course_groups |
| POST | `/api/instructor/v1/courses/{course_key}/cohorts` | openedx.core.djangoapps.course_groups |
| PUT | `/api/instructor/v1/courses/{course_key}/cohorts/{cohort_id}` | openedx.core.djangoapps.course_groups |
| DELETE | `/api/instructor/v1/courses/{course_key}/cohorts/{cohort_id}` | openedx.core.djangoapps.course_groups |
| POST | `/api/instructor/v1/courses/{course_key}/cohorts/{cohort_id}/students` | openedx.core.djangoapps.course_groups |
| DELETE | `/api/instructor/v1/courses/{course_key}/cohorts/{cohort_id}/students` | openedx.core.djangoapps.course_groups |
| POST | `/api/instructor/v1/courses/{course_key}/cohorts/csv_upload` | openedx.core.djangoapps.course_groups, util |

### Discussion Management API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/discussions/topics` | discussion |
| POST | `/api/instructor/v1/courses/{course_key}/discussions/topics` | discussion, xmodule.modulestore |
| PUT | `/api/instructor/v1/courses/{course_key}/discussions/topics/{topic_id}` | discussion |
| DELETE | `/api/instructor/v1/courses/{course_key}/discussions/topics/{topic_id}` | discussion |
| GET | `/api/instructor/v1/courses/{course_key}/discussions/settings` | discussion |
| PUT | `/api/instructor/v1/courses/{course_key}/discussions/settings` | discussion |

### Extensions & Deadlines API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/extensions` | util.date_utils |
| POST | `/api/instructor/v1/courses/{course_key}/extensions` | util.date_utils |
| PUT | `/api/instructor/v1/courses/{course_key}/extensions/{extension_id}` | util.date_utils |
| DELETE | `/api/instructor/v1/courses/{course_key}/extensions/{extension_id}` | util.date_utils |
| GET | `/api/instructor/v1/courses/{course_key}/extensions/{username}` | util.date_utils, student |

### Data Export API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/data_downloads` | instructor_task, util |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads` | instructor_task, util |
| GET | `/api/instructor/v1/courses/{course_key}/data_downloads/{download_id}` | instructor_task, util |
| DELETE | `/api/instructor/v1/courses/{course_key}/data_downloads/{download_id}` | instructor_task, util |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads/student_profiles` | instructor_task, student |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads/grade_report` | instructor_task, grades |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads/problem_grade_report` | instructor_task, grades |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads/course_structure` | instructor_task, xmodule.modulestore |
| POST | `/api/instructor/v1/courses/{course_key}/data_downloads/survey_results` | instructor_task, grades |

### Bulk Email API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/bulk_email` | bulk_email |
| POST | `/api/instructor/v1/courses/{course_key}/bulk_email` | bulk_email, instructor_task |
| GET | `/api/instructor/v1/courses/{course_key}/bulk_email/{email_id}` | bulk_email |
| GET | `/api/instructor/v1/courses/{course_key}/bulk_email/{email_id}/status` | bulk_email, instructor_task |
| DELETE | `/api/instructor/v1/courses/{course_key}/bulk_email/{email_id}` | bulk_email |
| GET | `/api/instructor/v1/courses/{course_key}/email_templates` | bulk_email |

### Special Exams API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/special_exams` | edx_proctoring, grades |
| GET | `/api/instructor/v1/courses/{course_key}/special_exams/{exam_id}` | edx_proctoring, grades |
| POST | `/api/instructor/v1/courses/{course_key}/special_exams/{exam_id}/reset/{username}` | edx_proctoring, InstructorService |
| GET | `/api/instructor/v1/courses/{course_key}/special_exams/{exam_id}/attempts` | edx_proctoring, grades |
| GET | `/api/instructor/v1/courses/{course_key}/proctoring_settings` | edx_proctoring |
| PUT | `/api/instructor/v1/courses/{course_key}/proctoring_settings` | edx_proctoring |
| POST | `/api/instructor/v1/courses/{course_key}/special_exams/{exam_id}/allowance` | edx_proctoring, student |

### Certificates API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/certificates` | certificates |
| POST | `/api/instructor/v1/courses/{course_key}/certificates/generate` | certificates, instructor_task |
| POST | `/api/instructor/v1/courses/{course_key}/certificates/generate/{username}` | certificates, student |
| POST | `/api/instructor/v1/courses/{course_key}/certificates/generate_bulk` | certificates, instructor_task |
| GET | `/api/instructor/v1/courses/{course_key}/certificates/allowlist` | certificates |
| POST | `/api/instructor/v1/courses/{course_key}/certificates/allowlist` | certificates, student |
| DELETE | `/api/instructor/v1/courses/{course_key}/certificates/allowlist` | certificates |
| GET | `/api/instructor/v1/courses/{course_key}/certificates/{certificate_id}/status` | certificates |

### Open Response Assessment API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/ora` | ora_staff_grader, xmodule.modulestore |
| GET | `/api/instructor/v1/courses/{course_key}/ora/{ora_id}` | ora_staff_grader, xmodule.modulestore |
| GET | `/api/instructor/v1/courses/{course_key}/ora/{ora_id}/submissions` | ora_staff_grader |
| GET | `/api/instructor/v1/courses/{course_key}/ora/{ora_id}/submissions/{submission_id}` | ora_staff_grader |
| POST | `/api/instructor/v1/courses/{course_key}/ora/{ora_id}/submissions/{submission_id}/override_grade` | ora_staff_grader |
| POST | `/api/instructor/v1/courses/{course_key}/ora/{ora_id}/submissions/{submission_id}/reset` | ora_staff_grader |

### Analytics API
| Method | Endpoint | Services |
|--------|----------|----------|
| GET | `/api/instructor/v1/courses/{course_key}/analytics/dashboard_url` | instructor_analytics |
| GET | `/api/instructor/v1/courses/{course_key}/analytics/summary` | instructor_analytics, student |
| GET | `/api/instructor/v1/courses/{course_key}/analytics/engagement` | instructor_analytics |
| GET | `/api/instructor/v1/courses/{course_key}/analytics/performance` | instructor_analytics, grades |
| GET | `/api/instructor/v1/courses/{course_key}/analytics/enrollment_stats` | instructor_analytics, enrollments |

