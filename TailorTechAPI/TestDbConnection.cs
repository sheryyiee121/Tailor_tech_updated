using Microsoft.EntityFrameworkCore;
using TailorTechAPI.Data;

// Simple test program to check database
public class TestDbConnection
{
    public static void TestDatabase()
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlite("Data Source=tailortech.db");

        using (var context = new AppDbContext(optionsBuilder.Options))
        {
            Console.WriteLine("=== DATABASE TEST ===");
            Console.WriteLine($"Users count: {context.Users.Count()}");
            Console.WriteLine($"Orders count: {context.Orders.Count()}");
            
            Console.WriteLine("\n=== USERS ===");
            foreach (var user in context.Users.ToList())
            {
                Console.WriteLine($"- {user.Email} (UID: {user.Uid})");
            }
            
            Console.WriteLine("\n=== ORDERS ===");
            foreach (var order in context.Orders.ToList())
            {
                Console.WriteLine($"- Order {order.OrderId}: {order.CustomerEmail}");
            }
        }
    }
}

