using System.Reflection;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using AutoMapper;
using Hypesoft.Application.Mappings;

namespace Hypesoft.Application.Interfaces;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(assembly));
        services.AddAutoMapper(typeof(AutoMapperProfile));
        services.AddValidatorsFromAssembly(assembly);

        return services;
    }
}
