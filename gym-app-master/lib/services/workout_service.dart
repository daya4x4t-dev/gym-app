import 'api_service.dart';

class WorkoutService {
  final _api = ApiService.instance;
  Future<dynamic> getWorkouts(String userId) => _api.get('/workouts/$userId');
  Future<dynamic> addWorkout(Map<String, dynamic> data) => _api.post('/workouts', body: data);
  Future<dynamic> updateWorkout(String workoutId, Map<String, dynamic> data) => _api.put('/workouts/$workoutId', body: data);
  Future<dynamic> deleteWorkout(String workoutId) => _api.delete('/workouts/$workoutId');
}
