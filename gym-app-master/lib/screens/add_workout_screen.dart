import 'package:flutter/material.dart';

class AddWorkoutScreen extends StatefulWidget {
  const AddWorkoutScreen({super.key});

  @override
  State<AddWorkoutScreen> createState() => _AddWorkoutScreenState();
}

class _AddWorkoutScreenState extends State<AddWorkoutScreen> {
  final exerciseController = TextEditingController();

  @override
  void dispose() {
    exerciseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Workout')),
      body: ListView(padding: const EdgeInsets.all(16), children: [
        TextField(controller: exerciseController, decoration: const InputDecoration(labelText: 'Exercise Name')),
        const SizedBox(height: 12),
        Row(children: [
          Expanded(child: OutlinedButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel'))),
          const SizedBox(width: 8),
          Expanded(child: ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('Save'))),
        ])
      ]),
    );
  }
}
