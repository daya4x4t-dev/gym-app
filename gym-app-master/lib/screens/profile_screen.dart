import 'package:flutter/material.dart';
import 'edit_profile_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFFF2E2E)))
          : ListView(
              padding: const EdgeInsets.all(16),
              children: [
                const CircleAvatar(radius: 45, backgroundColor: Color(0xFFFF2E2E), child: Icon(Icons.person, color: Colors.white, size: 40)),
                const SizedBox(height: 12),
                const Text('Joined: 2026-01-01', style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 20),
                ElevatedButton(onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const EditProfileScreen())), child: const Text('Edit Profile')),
              ],
            ),
    );
  }
}
