using AutoMapper;
using Hypesoft.Domain.Entities;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Commands;

namespace Hypesoft.Application.Mappings;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price.Value))
            .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity.Value))
            .ForMember(dest => dest.IsLowStock, opt => opt.MapFrom(src => src.IsLowStock))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty));

        CreateMap<Category, CategoryDto>();

        CreateMap<CreateProductDto, CreateProductCommand>();
        CreateMap<UpdateProductDto, UpdateProductCommand>();
    }
}
