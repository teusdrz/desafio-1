using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Hypesoft.API.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        var connectionId = Context.ConnectionId;

        _logger.LogInformation("User {UserId} connected with connection {ConnectionId}", userId, connectionId);

        // Join user to their personal group
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.AddToGroupAsync(connectionId, $"user_{userId}");
        }

        // Join all users to general notifications group
        await Groups.AddToGroupAsync(connectionId, "general_notifications");

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.UserIdentifier;
        var connectionId = Context.ConnectionId;

        _logger.LogInformation("User {UserId} disconnected with connection {ConnectionId}", userId, connectionId);

        if (exception != null)
        {
            _logger.LogError(exception, "User {UserId} disconnected with error", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Join a specific room/channel
    /// </summary>
    public async Task JoinRoom(string roomName)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            _logger.LogInformation("User {UserId} joined room {RoomName}",
                Context.UserIdentifier, roomName);

            await Clients.Group(roomName).SendAsync("UserJoinedRoom", new
            {
                UserId = Context.UserIdentifier,
                Username = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous",
                RoomName = roomName,
                JoinedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining room {RoomName} for user {UserId}",
                roomName, Context.UserIdentifier);
        }
    }

    /// <summary>
    /// Leave a specific room/channel
    /// </summary>
    public async Task LeaveRoom(string roomName)
    {
        try
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

            _logger.LogInformation("User {UserId} left room {RoomName}",
                Context.UserIdentifier, roomName);

            await Clients.Group(roomName).SendAsync("UserLeftRoom", new
            {
                UserId = Context.UserIdentifier,
                Username = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous",
                RoomName = roomName,
                LeftAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving room {RoomName} for user {UserId}",
                roomName, Context.UserIdentifier);
        }
    }

    /// <summary>
    /// Send message to a specific room
    /// </summary>
    public async Task SendMessageToRoom(string roomName, string message)
    {
        try
        {
            var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous";
            var userId = Context.UserIdentifier;

            _logger.LogInformation("User {UserId} sent message to room {RoomName}", userId, roomName);

            await Clients.Group(roomName).SendAsync("ReceiveMessage", new
            {
                UserId = userId,
                Username = username,
                Message = message,
                RoomName = roomName,
                SentAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message to room {RoomName} for user {UserId}",
                roomName, Context.UserIdentifier);
        }
    }

    /// <summary>
    /// Send typing indicator to room
    /// </summary>
    public async Task SendTypingIndicator(string roomName, bool isTyping)
    {
        try
        {
            var username = Context.User?.FindFirst(ClaimTypes.Name)?.Value ?? "Anonymous";
            var userId = Context.UserIdentifier;

            await Clients.GroupExcept(roomName, Context.ConnectionId).SendAsync("UserTyping", new
            {
                UserId = userId,
                Username = username,
                RoomName = roomName,
                IsTyping = isTyping,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending typing indicator to room {RoomName} for user {UserId}",
                roomName, Context.UserIdentifier);
        }
    }

    /// <summary>
    /// Get online users count for a room
    /// </summary>
    public async Task GetOnlineUsersCount(string roomName)
    {
        try
        {
            // Note: This is a simplified implementation
            // In production, you might want to maintain a proper users list
            await Clients.Caller.SendAsync("OnlineUsersCount", new
            {
                RoomName = roomName,
                Count = 1, // Placeholder - implement proper counting logic
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting online users count for room {RoomName}", roomName);
        }
    }
}
