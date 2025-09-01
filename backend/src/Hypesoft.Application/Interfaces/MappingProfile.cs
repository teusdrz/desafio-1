using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Application.Interfaces;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price.Value))
            .ForMember(dest => dest.StockQuantity, opt => opt.MapFrom(src => src.StockQuantity.Value))
            .ForMember(dest => dest.CategoryName, opt => opt.Ignore());

        CreateMap<Category, CategoryDto>()
            .ForMember(dest => dest.ProductsCount, opt => opt.MapFrom(src => src.Products.Count));

        CreateMap<CreateProductDto, Product>();
        CreateMap<CreateCategoryDto, Category>();
    }
}
