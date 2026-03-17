import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/intro_screen.dart';

void main() {
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
  };

  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider()..init(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    ErrorWidget.builder = (FlutterErrorDetails details) => const Scaffold(
          body: Center(
            child: Text('Something went wrong', style: TextStyle(color: Colors.white)),
          ),
        );

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(scaffoldBackgroundColor: const Color(0xFF0D0D0D), fontFamily: 'Poppins', brightness: Brightness.dark),
      home: const IntroScreen(),
    );
  }
}
