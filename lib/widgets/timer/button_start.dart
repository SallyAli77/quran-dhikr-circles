import 'package:flutter/material.dart';

class CustomElevatedButton extends StatelessWidget {
  final bool isCountingDown;
  final VoidCallback startCountdown;

  const CustomElevatedButton({super.key, 
    required this.isCountingDown,
    required this.startCountdown,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: isCountingDown ? null : startCountdown,
      child: const Text('Start circle'),
    );
  }
}
