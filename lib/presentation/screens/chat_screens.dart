import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:circles_online_muslim_community/core/theme/app_theme.dart';

class ChatListScreen extends StatelessWidget {
  const ChatListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView.builder(
        padding: const EdgeInsets.only(bottom: 100, top: 16),
        itemCount: 10,
        itemBuilder: (context, index) {
          final isCircle = index % 3 == 0;
          return ListTile(
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(builder: (_) => const ChatDetailScreen()));
            },
            leading: CircleAvatar(
              backgroundColor: isCircle ? AppTheme.primary.withOpacity(0.2) : Colors.grey.shade200,
              radius: 24,
              child: Icon(isCircle ? LucideIcons.users : LucideIcons.user, color: isCircle ? AppTheme.primary : AppTheme.textMuted),
            ),
            title: Text(
              isCircle ? "Quran Memorization Group" : "Mohamed Ahmed",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Text(
              isCircle ? "Mohamed: SubhanAllah..." : "Assalamu Alaikum, how are you?",
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                const Text("12:30 PM", style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                const SizedBox(height: 4),
                if (index % 2 == 0)
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: const BoxDecoration(color: AppTheme.primary, shape: BoxShape.circle),
                    child: const Text("2", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class ChatDetailScreen extends StatelessWidget {
  const ChatDetailScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: AppTheme.primary.withOpacity(0.2),
              radius: 16,
              child: const Icon(LucideIcons.users, color: AppTheme.primary, size: 16),
            ),
            const SizedBox(width: 12),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Quran Memorization Group", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  Text("12 members", style: TextStyle(fontSize: 12, color: AppTheme.textMuted)),
                ],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(icon: const Icon(LucideIcons.phone), onPressed: () {}),
          IconButton(icon: const Icon(LucideIcons.info), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              reverse: true, // Messages start from bottom
              itemCount: 20,
              itemBuilder: (context, index) {
                final isMe = index % 3 == 0;
                return _buildMessageBubble(isMe, "SubhanAllah ${index + 1}");
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(bool isMe, String message) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: const BoxConstraints(maxWidth: 250),
        decoration: BoxDecoration(
          color: isMe ? AppTheme.primary : AppTheme.card,
          border: isMe ? null : Border.all(color: AppTheme.border),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isMe ? 16 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 16),
          ),
        ),
        child: Text(
          message,
          style: TextStyle(color: isMe ? Colors.white : AppTheme.text),
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppTheme.card,
        border: Border(top: BorderSide(color: AppTheme.border)),
      ),
      child: SafeArea(
        child: Row(
          children: [
            IconButton(
              icon: const Icon(LucideIcons.paperclip, color: AppTheme.textMuted),
              onPressed: () {},
            ),
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: AppTheme.background,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppTheme.border),
                ),
                child: const TextField(
                  decoration: InputDecoration(
                    hintText: "Type a message...",
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: const BoxDecoration(color: AppTheme.primary, shape: BoxShape.circle),
              child: IconButton(
                icon: const Icon(LucideIcons.send, color: Colors.white, size: 18),
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}
