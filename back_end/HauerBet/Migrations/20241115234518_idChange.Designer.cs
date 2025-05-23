﻿// <auto-generated />
using HauerBet;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace HauerBet.Migrations
{
    [DbContext(typeof(HauerBetContext))]
    [Migration("20241115234518_idChange")]
    partial class idChange
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.0");

            modelBuilder.Entity("HauerBet.Fixture", b =>
                {
                    b.Property<int>("FixtureID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<float>("AwayLine")
                        .HasColumnType("REAL");

                    b.Property<string>("AwayTeam")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<float>("HomeLine")
                        .HasColumnType("REAL");

                    b.Property<string>("HomeTeam")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Vig")
                        .HasColumnType("INTEGER");

                    b.HasKey("FixtureID");

                    b.ToTable("Fixtures");
                });
#pragma warning restore 612, 618
        }
    }
}
