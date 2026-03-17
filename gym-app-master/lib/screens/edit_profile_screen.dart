import 'package:flutter/material.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final ageController = TextEditingController();
  final weightController = TextEditingController();
  final heightController = TextEditingController();
  String goal = 'General Fitness';

  @override
  void dispose() {
    ageController.dispose();
    weightController.dispose();
    heightController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profile')),
      body: Form(
        key: _formKey,
        child: ListView(padding: const EdgeInsets.all(16), children: [
          TextFormField(controller: ageController, keyboardType: TextInputType.number, validator: (v) {
            final value = int.tryParse(v ?? '');
            if (value == null || value < 10 || value > 100) return 'Age must be 10-100';
            return null;
          }),
          TextFormField(controller: weightController, keyboardType: TextInputType.number, validator: (v) {
            final value = double.tryParse(v ?? '');
            if (value == null || value < 20 || value > 300) return 'Weight must be 20-300';
            return null;
          }),
          TextFormField(controller: heightController, keyboardType: TextInputType.number, validator: (v) {
            final value = double.tryParse(v ?? '');
            if (value == null || value < 100 || value > 250) return 'Height must be 100-250';
            return null;
          }),
          DropdownButtonFormField<String>(
            value: goal,
            items: const ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness']
                .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                .toList(),
            onChanged: (value) => setState(() => goal = value ?? goal),
          ),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: () {
            if (_formKey.currentState!.validate()) Navigator.pop(context);
          }, child: const Text('Save')),
        ]),
      ),
    );
  }
}
