import 'package:circles_online_muslim_community/pages/plus.dart';
import 'package:circles_online_muslim_community/pages/profile.dart';
import 'package:circles_online_muslim_community/pages/sadka_wall.dart';
import 'package:circles_online_muslim_community/src/constants/colors.dart';
import 'package:flutter/material.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';

import 'home.dart';
import 'inbox.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  void _navigateBottomBar(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  final List<Widget> _pages = [
    const UserHomePage(),
    const SadkaWall(),
    const UserPlusPage(),
    const UserInboxPage(),
    const UserProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBarWidget(
        selectedIndex: _selectedIndex,
        onTabTapped: _navigateBottomBar,
      ),
    );
  }
}

class BottomNavigationBarWidget extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onTabTapped;

  const BottomNavigationBarWidget({
    Key? key,
    required this.selectedIndex,
    required this.onTabTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CurvedNavigationBar(
      onTap: onTabTapped,
      backgroundColor: tPrimaryColor,
      color: tSecondaryColor,
      animationDuration: const Duration(milliseconds: 300),
      height: 50.00,
      items: const [
        Icon(Icons.home),
        Icon(Icons.family_restroom),
        Icon(Icons.add_box_rounded),
        Icon(Icons.chat_bubble_rounded),
        Icon(Icons.person),
      ],
      index: selectedIndex,
    );
  }
}
