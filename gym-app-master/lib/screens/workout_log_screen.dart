import 'package:flutter/material.dart';
import 'add_workout_screen.dart';

class WorkoutLogScreen extends StatefulWidget {
  const WorkoutLogScreen({super.key});

  @override
  State<WorkoutLogScreen> createState() => _WorkoutLogScreenState();
}

class _WorkoutLogScreenState extends State<WorkoutLogScreen> {
  final items = <Map<String, String>>[];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workout Log')),
      body: ListView.builder(
        itemCount: items.length,
        itemBuilder: (context, index) => Dismissible(
          key: ValueKey(index),
          onDismissed: (_) => setState(() => items.removeAt(index)),
          child: ListTile(
            title: Text(items[index]['exercise'] ?? '', style: const TextStyle(color: Colors.white)),
            subtitle: Text(items[index]['date'] ?? '', style: const TextStyle(color: Colors.white70)),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AddWorkoutScreen())),
        child: const Icon(Icons.add),
      ),
    );
  }
}
