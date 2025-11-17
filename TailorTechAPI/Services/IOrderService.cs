using TailorTechAPI.Models;

namespace TailorTechAPI.Services
{
    public interface IOrderService
    {
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order?> GetOrderByIdAsync(int id);
        Task<Order?> GetOrderByOrderIdAsync(string orderId);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<Order> CreateOrderAsync(Order order);
        Task<bool> UpdateOrderStatusAsync(int id, string status);
        Task<bool> DeleteOrderAsync(int id);
        Task<int> GetTotalOrdersCountAsync();
        Task<int> GetOrdersCountByStatusAsync(string status);
    }
}

